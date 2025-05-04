"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { useMapboxToken } from "@/hooks/useMapboxToken"

interface SaadPoliceStationMapProps {
  coordinates?: [number, number]
}

export function SaadPoliceStationMap({ coordinates = [55.5789, 24.1942] }: SaadPoliceStationMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const { token, loading, error } = useMapboxToken()

  useEffect(() => {
    if (map.current) return // initialize map only once
    if (loading) return
    if (error || !token) {
      console.error("Mapbox access token error:", error)
      return
    }

    // Set the token from our secure API
    mapboxgl.accessToken = token

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      // Use satellite imagery with street overlays for better context
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: coordinates,
      zoom: 16, // Zoom in closer for better satellite view
      pitch: 45,
      bearing: 30, // Slight angle for better perspective
    })

    map.current.on("load", () => {
      setMapLoaded(true)
    })

    // Add navigation controls
    const nav = new mapboxgl.NavigationControl({
      visualizePitch: true,
    })
    map.current.addControl(nav, "top-right")

    // Add fullscreen control
    map.current.addControl(new mapboxgl.FullscreenControl(), "top-right")

    return () => {
      map.current?.remove()
    }
  }, [coordinates, token, loading, error])

  useEffect(() => {
    if (!mapLoaded || !map.current) return

    // Clear any existing markers
    const existingMarkers = document.querySelectorAll(".mapboxgl-marker")
    existingMarkers.forEach((marker) => marker.remove())

    // Create a custom marker element with pulsing effect
    const markerElement = document.createElement("div")
    markerElement.className = "custom-marker"
    markerElement.style.width = "25px"
    markerElement.style.height = "25px"
    markerElement.style.borderRadius = "50%"
    markerElement.style.backgroundColor = "#1B1464"
    markerElement.style.border = "3px solid white"
    markerElement.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)"
    markerElement.style.animation = "pulse 1.5s infinite"

    // Add the pulsing animation style
    const style = document.createElement("style")
    style.textContent = `
      @keyframes pulse {
        0% {
          box-shadow: 0 0 0 0 rgba(27, 20, 100, 0.7);
        }
        70% {
          box-shadow: 0 0 0 15px rgba(27, 20, 100, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(27, 20, 100, 0);
        }
      }
    `
    document.head.appendChild(style)

    // Add the marker to the map
    new mapboxgl.Marker(markerElement)
      .setLngLat(coordinates)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div style="padding: 10px; text-align: center;">
              <h3 style="margin: 0 0 5px 0; font-weight: bold;">مركز شرطة الساد</h3>
              <p style="margin: 0;">Saad Police Station</p>
            </div>
          `),
      )
      .addTo(map.current)

    // Add a 3D building layer if available
    if (!map.current.getLayer("3d-buildings")) {
      map.current.addLayer(
        {
          id: "3d-buildings",
          source: "composite",
          "source-layer": "building",
          filter: ["==", "extrude", "true"],
          type: "fill-extrusion",
          minzoom: 15,
          paint: {
            "fill-extrusion-color": "#aaa",
            "fill-extrusion-height": ["interpolate", ["linear"], ["zoom"], 15, 0, 15.05, ["get", "height"]],
            "fill-extrusion-base": ["interpolate", ["linear"], ["zoom"], 15, 0, 15.05, ["get", "min_height"]],
            "fill-extrusion-opacity": 0.6,
          },
        },
        "road-label",
      )
    }

    // Fly to the location with animation
    map.current.flyTo({
      center: coordinates,
      zoom: 17,
      pitch: 60,
      bearing: 30,
      duration: 2000,
      essential: true,
    })
  }, [mapLoaded, coordinates])

  // Show loading state while fetching the token
  if (loading) {
    return (
      <div className="relative w-full h-full rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      </div>
    )
  }

  // Show error state if token fetch failed
  if (error) {
    return (
      <div className="relative w-full h-full rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <div className="text-red-500 text-center p-4">
            <p className="font-bold">Error loading map</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" style={{ minHeight: "300px" }} />
      {!mapLoaded && token && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      )}
      <div className="absolute bottom-2 left-2 bg-white/80 px-2 py-1 text-xs rounded">Satellite imagery © Mapbox</div>
    </div>
  )
}
