"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { useMapboxToken } from "../hooks/useMapboxToken"

interface AnyMapComponentProps {
  center: [number, number]
  zoom: number
  style?: string
  children?: React.ReactNode
  onMapLoad?: (map: mapboxgl.Map) => void
  className?: string
  mapStyle?: string
}

export default function AnyMapComponent({
  center,
  zoom,
  style = "mapbox://styles/mapbox/streets-v11",
  children,
  onMapLoad,
  className = "",
  mapStyle,
}: AnyMapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const { token, loading, error } = useMapboxToken()

  useEffect(() => {
    if (loading || error || !token || !mapContainer.current) return

    if (map.current) return // already initialized

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle || style,
      center: center,
      zoom: zoom,
      accessToken: token,
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
  }, [center, zoom, style, mapStyle, onMapLoad, token, loading, error])

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
