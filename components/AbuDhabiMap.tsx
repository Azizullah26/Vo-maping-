"use client"

import { useEffect, useRef, useState, useCallback } from "react"
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
  const [markers, setMarkers] = useState<any[]>([])

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
        preserveDrawingBuffer: true, // Add this to prevent flickering
        renderWorldCopies: false, // Add this to prevent duplicate maps
      })

      // Set up event handlers
      map.current.on("load", () => {
        console.log("Abu Dhabi map loaded successfully")
        setMapLoaded(true)

        if (!map.current) return

        // Create Abu Dhabi marker with custom styling
        const abuDhabiCoordinates = [54.37, 24.47]
        const markerElement = document.createElement("div")
        markerElement.className = "custom-marker abu-dhabi-marker"

        // Create the marker
        const marker = new mapboxgl.Marker({
          element: markerElement,
          anchor: "center",
        })
          .setLngLat(abuDhabiCoordinates)
          .addTo(map.current)

        // Add to markers state for reference
        setMarkers((prev) => [...prev, { marker, name: "Abu Dhabi" }])

        // Create a custom DOM element for the Abu Dhabi marker with dashed lines
        const abuDhabiMarker = document.createElement("div")
        abuDhabiMarker.className = "abu-dhabi-custom-marker"
        abuDhabiMarker.innerHTML = `
        <div class="marker-container">
          <div class="marker-label">Abu Dhabi</div>
          <div class="marker-dot"></div>
          <div class="dashed-line-vertical"></div>
          <div class="marker-endpoint"></div>
        </div>
      `

        // Add custom styles for the Abu Dhabi marker
        const style = document.createElement("style")
        style.textContent = `
        .abu-dhabi-custom-marker {
          position: absolute;
          transform: translate(-50%, -50%);
          z-index: 10;
        }
        
        .marker-container {
          position: relative;
        }
        
        .marker-label {
          background: linear-gradient(45deg, #ffbc00, #ff0058);
          color: white;
          padding: 5px 10px;
          border-radius: 15px;
          font-weight: bold;
          white-space: nowrap;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
        }
        
        .marker-dot {
          position: absolute;
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
          width: 10px;
          height: 10px;
          background-color: white;
          border-radius: 50%;
        }
        
        .dashed-line-vertical {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          width: 2px;
          height: 60px;
          background-image: linear-gradient(0deg, white 50%, transparent 50%);
          background-size: 2px 8px;
          background-repeat: repeat-y;
        }
        
        .marker-endpoint {
          position: absolute;
          top: calc(100% + 60px);
          left: 50%;
          transform: translate(-50%, -50%);
          width: 12px;
          height: 12px;
          background-color: white;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
        }
      `
        document.head.appendChild(style)

        // Add the custom marker to the map
        new mapboxgl.Marker(abuDhabiMarker).setLngLat(abuDhabiCoordinates).addTo(map.current)
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

  // Fix the animate function to prevent continuous rerendering
  const handleToggleTerrain = useCallback(() => {
    if (!map.current) return

    const currentPitch = map.current.getPitch()
    map.current.easeTo({
      pitch: currentPitch > 0 ? 0 : 45,
      duration: 1000,
    })
  }, [])

  // Update the div positioning to be relative instead of fixed
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

      <div ref={mapContainer} className="absolute inset-0 w-full h-full z-0" />

      {/* Dark overlay with 40% transparency */}
      <div
        className="absolute inset-0 w-full h-full z-[1]"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          pointerEvents: "none",
        }}
      />

      <AnimatedControls
        onResetView={useCallback(() => {
          map.current?.easeTo({
            bearing: 0,
            pitch: 0,
            duration: 1500,
          })
        }, [])}
        onToggleTerrain={handleToggleTerrain}
      />
    </div>
  )
}
