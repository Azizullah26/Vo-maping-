"use client"

import React, { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { useMapboxToken } from "@/hooks/useMapboxToken"

interface MapComponentProps {
  center: [number, number]
  zoom: number
  style?: string
  children?: React.ReactNode
}

export default function MapComponent({
  center,
  zoom,
  style = "mapbox://styles/mapbox/streets-v11",
  children,
}: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const { token, loading, error } = useMapboxToken()
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    if (!token || loading || error) return

    if (map.current) return // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: style,
      center: center,
      zoom: zoom,
      accessToken: token,
    })

    map.current.on("load", () => {
      setMapLoaded(true)
    })

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [center, zoom, style, token, loading, error])

  if (loading) return <div className="h-full w-full flex items-center justify-center">Loading map...</div>
  if (error)
    return <div className="h-full w-full flex items-center justify-center text-red-500">Error loading map: {error}</div>

  return (
    <div className="h-full w-full">
      <div ref={mapContainer} className="h-full w-full" />
      {mapLoaded &&
        map.current &&
        children &&
        React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { map: map.current })
          }
          return child
        })}
    </div>
  )
}
