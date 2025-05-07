"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { AnimatedControls } from "@/components/AnimatedControls"
import { useMapboxToken } from "@/hooks/useMapboxToken"

export default function AbuDhabiMap() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)
  const { token, loading, error } = useMapboxToken()

  useEffect(() => {
    if (map.current) return // already initialized
    if (loading) return
    if (error || !token) {
      setMapError("Mapbox access token error: " + (error || "Token not available"))
      return
    }

    try {
      console.log("Initializing Abu Dhabi map with token:", token.substring(0, 5) + "...")
      mapboxgl.accessToken = token

      // Initialize map
      map.current = new mapboxgl.Map({
        container: mapContainer.current!,
        style: "mapbox://styles/azizullah2611/cm7009fqu01j101pbe23262j4", // Use the specified style
        center: [54.37, 24.47], // Abu Dhabi coordinates
        zoom: 11,
        pitch: 0,
        bearing: 0,
      })

      // Add navigation controls
      const nav = new mapboxgl.NavigationControl({
        visualizePitch: true,
        showZoom: true,
        showCompass: true,
      })
      map.current.addControl(nav, "bottom-right")

      // Set up event handlers
      map.current.on("load", () => {
        console.log("Abu Dhabi map loaded successfully")
        setMapLoaded(true)

        if (!map.current) return

        // Add a simple marker for Abu Dhabi
        new mapboxgl.Marker({ color: "#FF0000" }).setLngLat([54.37, 24.47]).addTo(map.current)
      })

      map.current.on("error", (e) => {
        console.error("Mapbox error:", e)
        setMapError(`Map error: ${e.error?.message || "Unknown error"}`)
      })
    } catch (err) {
      console.error("Error initializing map:", err)
      setMapError(`Failed to initialize map: ${err instanceof Error ? err.message : String(err)}`)
    }

    // Cleanup function
    return () => {
      try {
        if (map.current) {
          console.log("Cleaning up Abu Dhabi map")
          map.current.remove()
          map.current = null
        }
      } catch (err) {
        console.error("Error during map cleanup:", err)
      }
    }
  }, [token, loading, error])

  // Handle toggle terrain (placeholder function)
  const handleToggleTerrain = () => {
    if (!map.current) return

    const currentPitch = map.current.getPitch()
    map.current.easeTo({
      pitch: currentPitch > 0 ? 0 : 45,
      duration: 1000,
    })
  }

  return (
    <div className="relative w-full h-full">
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-100 z-10">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-md">
            <h3 className="text-lg font-bold text-red-600">Map Error</h3>
            <p className="mt-2">{mapError}</p>
          </div>
        </div>
      )}

      {!mapLoaded && !mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      <div
        ref={mapContainer}
        className="absolute inset-0 w-screen h-screen z-0"
        style={{ position: "fixed", top: 0, left: 0 }}
      />

      {/* Dark overlay with 40% transparency */}
      <div
        className="absolute inset-0 w-screen h-screen z-[1]"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          pointerEvents: "none",
        }}
      />

      <AnimatedControls
        onResetView={() => {
          map.current?.easeTo({
            bearing: 0,
            pitch: 0,
            duration: 1500,
          })
        }}
        onToggleTerrain={handleToggleTerrain}
      />
    </div>
  )
}
