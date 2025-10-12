"use client"

import type React from "react"
import { useRef, useEffect, useState, useCallback } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { abuDhabiCityBoundary } from "@/data/abuDhabiCityCoordinates"
import { ErrorBoundary } from "react-error-boundary"

const AbuDhabiMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const abuDhabiCityData = abuDhabiCityBoundary

  const initialZoom = 6.5
  const maxZoom = 12

  const addRegion = useCallback((id: string, data: any, color: string) => {
    if (!map.current) return

    if (!map.current.getSource(id)) {
      map.current.addSource(id, {
        type: "geojson",
        data: data,
      })
    }

    if (!map.current.getLayer(`${id}-fill`)) {
      map.current.addLayer({
        id: `${id}-fill`,
        type: "fill",
        source: id,
        paint: {
          "fill-color": color,
          "fill-opacity": 0.5,
        },
      })
    }

    if (!map.current.getLayer(`${id}-outline`)) {
      map.current.addLayer({
        id: `${id}-outline`,
        type: "line",
        source: id,
        paint: {
          "line-color": ["interpolate", ["linear"], ["get", "time"], 0, "#070707", 1, "#687aff"],
          "line-width": 3,
          "line-gradient": ["interpolate", ["linear"], ["line-progress"], 0, "#070707", 1, "#687aff"],
        },
      })

      // Animate the line gradient
      let time = 0
      const animate = () => {
        time = (time + 0.005) % 1
        if (map.current) {
          map.current.setPaintProperty(`${id}-outline`, "line-gradient", [
            "interpolate",
            ["linear"],
            ["line-progress"],
            0,
            `hsl(${time * 360}, 70%, 50%)`,
            1,
            `hsl(${(time * 360 + 180) % 360}, 70%, 50%)`,
          ])
          requestAnimationFrame(animate)
        }
      }
      animate()
    }
  }, [])

  const initializeMap = useCallback(() => {
    if (map.current) return // initialize map only once

    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
    if (!accessToken) {
      setError("Mapbox access token is missing")
      return
    }

    mapboxgl.accessToken = accessToken

    // Calculate the center of Abu Dhabi city coordinates
    let centerLng = 0
    let centerLat = 0
    let coordinateCount = 0

    try {
      abuDhabiCityData.features.forEach((feature) => {
        if (feature.geometry.type === "LineString") {
          feature.geometry.coordinates.forEach((coord) => {
            if (
              Array.isArray(coord) &&
              coord.length >= 2 &&
              typeof coord[0] === "number" &&
              typeof coord[1] === "number"
            ) {
              centerLng += coord[0]
              centerLat += coord[1]
              coordinateCount++
            } else {
              console.warn("Invalid coordinate:", coord)
            }
          })
        }
      })

      if (coordinateCount > 0) {
        centerLng /= coordinateCount
        centerLat /= coordinateCount
      } else {
        throw new Error("No valid coordinates found")
      }
    } catch (error) {
      console.error("Error calculating map center:", error)
      // Fallback to default coordinates
      centerLng = 54.3773
      centerLat = 24.4539
    }

    try {
      if (!mapContainer.current) {
        throw new Error("Map container not found")
      }

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/azizullah2611/cm7009fqu01j101pbe23262j4",
        center: [centerLng, centerLat],
        zoom: initialZoom,
        maxZoom: maxZoom,
        minZoom: initialZoom,
      })

      map.current?.on("load", () => {
        console.log("Map loaded successfully")
        setMapLoaded(true)

        const bounds = new mapboxgl.LngLatBounds()
        let hasBounds = false

        try {
          abuDhabiCityData.features.forEach((feature) => {
            if (feature.geometry.type === "LineString") {
              feature.geometry.coordinates.forEach((coord) => {
                if (
                  Array.isArray(coord) &&
                  coord.length >= 2 &&
                  typeof coord[0] === "number" &&
                  typeof coord[1] === "number"
                ) {
                  bounds.extend(coord as [number, number])
                  hasBounds = true
                } else {
                  console.warn("Invalid coordinate for bounds:", coord)
                }
              })
            }
          })

          if (hasBounds && map.current) {
            map.current.fitBounds(bounds, {
              padding: 20,
              maxZoom: initialZoom,
            })
          } else {
            console.warn("No valid bounds found")
          }
        } catch (error) {
          console.error("Error setting map bounds:", error)
        }

        // Add Abu Dhabi city polygon
        try {
          if (!map.current) throw new Error("Map not initialized")

          addRegion("abu-dhabi-city", abuDhabiCityData, "#D3D3D3")

          // Add click event listener
          map.current?.on("click", "abu-dhabi-city-fill", (e) => {
            if (!e.lngLat) {
              console.warn("Click event has no coordinates")
              return
            }

            const bounds = new mapboxgl.LngLatBounds()
            let hasBounds = false

            abuDhabiCityData.features.forEach((feature) => {
              if (feature.geometry.type === "LineString") {
                feature.geometry.coordinates.forEach((coord) => {
                  if (
                    Array.isArray(coord) &&
                    coord.length >= 2 &&
                    typeof coord[0] === "number" &&
                    typeof coord[1] === "number"
                  ) {
                    bounds.extend(coord as [number, number])
                    hasBounds = true
                  }
                })
              }
            })

            if (hasBounds && map.current) {
              map.current.fitBounds(bounds, {
                padding: 20,
                duration: 2000,
                maxZoom: maxZoom,
              })
            } else {
              console.warn("No valid bounds found for click event")
            }
          })

          // Change cursor to pointer when hovering over the polygon
          map.current?.on("mouseenter", "abu-dhabi-city-fill", () => {
            if (map.current) {
              map.current.getCanvas().style.cursor = "pointer"
              map.current.setPaintProperty("abu-dhabi-city-fill", "fill-color", "#A9A9A9")
              map.current.setPaintProperty("abu-dhabi-city-fill", "fill-opacity", 0.7)
            }
          })

          map.current?.on("mouseleave", "abu-dhabi-city-fill", () => {
            if (map.current) {
              map.current.getCanvas().style.cursor = ""
              map.current.setPaintProperty("abu-dhabi-city-fill", "fill-color", "#D3D3D3")
              map.current.setPaintProperty("abu-dhabi-city-fill", "fill-opacity", 0.5)
            }
          })
        } catch (error) {
          console.error("Error adding map layers:", error)
          setError("Error adding map layers")
        }
      })

      // Add zoom control to the bottom right
      map.current?.addControl(
        new mapboxgl.NavigationControl({
          showCompass: false,
          showZoom: true,
          visualizePitch: false,
        }),
        "bottom-right",
      )

      // Add zoom end event listener to prevent zooming out beyond the initial zoom level
      map.current?.on("zoomend", () => {
        if (map.current && map.current.getZoom() < initialZoom) {
          map.current.setZoom(initialZoom)
        }
      })

      // Add custom CSS to adjust zoom control position
      const style = document.createElement("style")
      style.textContent = `
        .mapboxgl-ctrl-bottom-right {
          bottom: 20px;
          right: 20px;
        }
      `
      document.head.appendChild(style)
    } catch (error) {
      console.error("Error initializing map:", error)
      setError("Error initializing map")
    }
  }, [abuDhabiCityData, addRegion])

  useEffect(() => {
    initializeMap()

    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [initializeMap])

  if (error) {
    return (
      <div className="w-full h-[calc(100vh-4rem)] flex items-center justify-center bg-red-100 text-red-700">
        Error: {error}
      </div>
    )
  }

  return (
    <div className="relative w-full h-[calc(100vh-4rem)]">
      <div ref={mapContainer} className="absolute inset-0 animated-border rounded-lg overflow-hidden" />
    </div>
  )
}

function ErrorFallback({ error, resetErrorBoundary }: { error: any; resetErrorBoundary: () => void }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

export default function AbuDhabiMapWithErrorBoundary() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AbuDhabiMap />
    </ErrorBoundary>
  )
}
