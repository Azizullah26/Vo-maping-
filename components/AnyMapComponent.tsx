"use client"

import { useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { useRouter } from "next/navigation"
import { createMapMarker, getMarkerAlignment } from "@/components/MapMarker"
import { mapStyles } from "@/lib/map-styles"
import { useMapboxToken } from "@/hooks/useMapboxToken"

interface Location {
  name: string
  coordinates: [number, number]
  // ... other properties
}

interface MapProps {
  locations: Location[]
  // ... other props
}

export default function MapComponent({ locations }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const router = useRouter()
  const { token, loading, error } = useMapboxToken()

  useEffect(() => {
    if (map.current) return
    if (loading) return
    if (error || !token) {
      console.error("Mapbox access token error:", error)
      return
    }

    mapboxgl.accessToken = token

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/dark-v11", // Use your preferred style
      center: [55.74523, 24.21089], // Set your default center
      zoom: 11.5,
    })

    // Add styles to document
    const styleSheet = document.createElement("style")
    styleSheet.textContent = mapStyles
    document.head.appendChild(styleSheet)

    map.current.on("load", () => {
      // Add markers
      locations.forEach((location) => {
        createMapMarker({
          name: location.name,
          coordinates: location.coordinates,
          alignment: getMarkerAlignment(location.name),
          onClick: (name) => {
            // Handle click event
            console.log(`Clicked ${name}`)
          },
          map: map.current!,
        })
      })
    })

    return () => {
      if (map.current) {
        map.current.remove()
      }
      document.head.removeChild(styleSheet)
    }
  }, [locations, token, loading, error])

  return <div ref={mapContainer} className="w-full h-full" />
}
