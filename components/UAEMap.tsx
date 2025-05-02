"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { alainBoundaryData } from "@/data/alainCoordinates"

const uaeData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [51.59112113593443, 24.267541247022507],
            [51.5906446311775, 24.253465939734525],
            // ... (rest of the coordinates)
            [51.591120897437435, 24.26753907893641],
          ],
        ],
      },
    },
  ],
}

const UAEMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapInitialized, setMapInitialized] = useState(false)

  const initialZoom = 6.5
  const maxZoom = 12

  useEffect(() => {
    if (mapInitialized) return
    if (map.current) return // initialize map only once

    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
    if (!accessToken) {
      console.error("Mapbox access token is missing")
      return
    }

    mapboxgl.accessToken = accessToken

    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/azizullah2611/cm7009fqu01j101pbe23262j4",
      center: [54.3773, 24.4539], // Centered on UAE
      zoom: initialZoom,
      minZoom: initialZoom,
      maxZoom: maxZoom,
    })

    mapInstance.on("load", () => {
      setMapLoaded(true)
    })

    // Add zoom end event listener to prevent zooming out beyond the initial zoom level
    mapInstance.on("zoomend", () => {
      if (mapInstance && mapInstance.getZoom() < initialZoom) {
        mapInstance.setZoom(initialZoom)
      }
    })

    map.current = mapInstance
    setMapInitialized(true)

    return () => {
      mapInstance?.remove()
    }
  }, [mapInitialized])

  useEffect(() => {
    if (!mapLoaded || !map.current) return

    if (!map.current.getSource("uae-boundary")) {
      map.current.addSource("uae-boundary", {
        type: "geojson",
        data: uaeData,
      })
    }

    if (!map.current.getLayer("uae-boundary-fill")) {
      map.current.addLayer({
        id: "uae-boundary-fill",
        type: "fill",
        source: "uae-boundary",
        layout: {},
        paint: {
          "fill-color": "#D3D3D3", // Light gray color
          "fill-opacity": 0.5,
        },
      })
    }

    if (!map.current.getLayer("uae-boundary-outline")) {
      map.current.addLayer({
        id: "uae-boundary-outline",
        type: "line",
        source: "uae-boundary",
        layout: {},
        paint: {
          "line-color": "#FFFFFF",
          "line-width": 2,
        },
      })
    }

    // Add Al Ain polygon
    if (!map.current.getSource("alain-boundary")) {
      map.current.addSource("alain-boundary", {
        type: "geojson",
        data: alainBoundaryData,
      })
    }

    if (!map.current.getLayer("alain-boundary-fill")) {
      map.current.addLayer({
        id: "alain-boundary-fill",
        type: "fill",
        source: "alain-boundary",
        layout: {},
        paint: {
          "fill-color": "#00FF00", // Green color
          "fill-opacity": 0.3, // Transparent
        },
      })
    }

    if (!map.current.getLayer("alain-boundary-line")) {
      map.current.addLayer({
        id: "alain-boundary-line",
        type: "line",
        source: "alain-boundary",
        layout: {},
        paint: {
          "line-color": "#00FF00",
          "line-width": 2,
        },
      })
    }

    // Add click event for zoom effect
    map.current.on("click", "alain-boundary-fill", (e) => {
      if (e.features && e.features[0].geometry.type === "Polygon") {
        const coordinates = e.features[0].geometry.coordinates as number[][][]
        const bounds = coordinates.reduce((bounds, polygon) => {
          polygon.forEach((ring) => {
            ring.forEach((coord) => {
              bounds.extend(coord as mapboxgl.LngLatLike)
            })
          })
          return bounds
        }, new mapboxgl.LngLatBounds(coordinates[0][0], coordinates[0][0]))

        map.current?.fitBounds(bounds, {
          padding: 50,
          duration: 1000,
        })
      }
    })

    // Change cursor to pointer when hovering over the polygon
    map.current.on("mouseenter", "alain-boundary-fill", () => {
      if (map.current) {
        map.current.getCanvas().style.cursor = "pointer"
      }
    })

    map.current.on("mouseleave", "alain-boundary-fill", () => {
      if (map.current) {
        map.current.getCanvas().style.cursor = ""
      }
    })
  }, [mapLoaded])

  return <div ref={mapContainer} className="w-full h-[calc(100vh-4rem)]" />
}

export default UAEMap
