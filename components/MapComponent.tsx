"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { useMapboxToken } from "../hooks/useMapboxToken"

// Add CSS to hide Mapbox attribution
const mapStyles = `
  .mapboxgl-ctrl-bottom-right {
    display: none !important;
  }
`

interface MapComponentProps {
  center: [number, number]
  zoom: number
  style?: string
  children?: React.ReactNode
  onMapLoad?: (map: mapboxgl.Map) => void
  className?: string
}

export default function MapComponent({
  center,
  zoom,
  style = "mapbox://styles/mapbox/streets-v11",
  children,
  onMapLoad,
  className = "",
}: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const { token, loading, error } = useMapboxToken()

  useEffect(() => {
    // Add the CSS to hide Mapbox attribution
    const styleElement = document.createElement("style")
    styleElement.textContent = mapStyles
    document.head.appendChild(styleElement)

    return () => {
      document.head.removeChild(styleElement)
    }
  }, [])

  useEffect(() => {
    if (loading || error || !token || !mapContainer.current) return

    if (map.current) return // already initialized

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: style,
      center: center,
      zoom: zoom,
      accessToken: token,
      attributionControl: false, // Disable attribution control
    })

    map.current.on("load", () => {
      setMapLoaded(true)
      if (onMapLoad && map.current) {
        onMapLoad(map.current)
      }
    })

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [center, zoom, style, onMapLoad, token, loading, error])

  if (error) {
    return <div className="text-red-500">Error loading map: {error.message}</div>
  }

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading map...</div>
  }

  return (
    <div className={`relative h-full w-full ${className}`}>
      <div ref={mapContainer} className="h-full w-full" />
      {mapLoaded && map.current && children}
    </div>
  )
}
