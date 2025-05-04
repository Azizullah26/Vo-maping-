"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { supabase } from "@/lib/supabaseClient"
import { useMapboxToken } from "@/hooks/useMapboxToken"

const uaeCoordinates = [
  [54.61615565741627, 24.449497308399685],
  [54.51911372649133, 24.422461458339882],
  [54.474605056462195, 24.426270693760557],
  [54.47651116150132, 24.423327287337983],
  [54.47721564666131, 24.421740175916796],
  [54.47752763274352, 24.42041144643231],
  [54.47764840154994, 24.419440090507607],
  [54.47862461606701, 24.419733330819966],
  [54.48230806465938, 24.42018235372673],
  [54.489315739750225, 24.420886214224836],
  [54.49020114108282, 24.42078699115271],
  [54.49287096664045, 24.419521890149525],
  [54.526189183617504, 24.403889447824213],
  [54.5388108671105, 24.390540863467237],
  [54.642971433043755, 24.410306060444725],
  [54.67289703745453, 24.40956454711457],
  [54.61615523225149, 24.449497277907696],
]

interface Marker {
  name: string
  lat: number
  lng: number
  videoUrl: string
}

export default function MapComponent({ onSelectLocation }) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [mapError, setMapError] = useState<string | null>(null)
  const [mapInitialized, setMapInitialized] = useState(false)
  const { token, loading, error } = useMapboxToken()

  useEffect(() => {
    if (mapInitialized) return // initialize map only once
    if (map.current) return
    if (loading) return
    if (error || !token) {
      setMapError("Mapbox access token error: " + (error || "Token not available"))
      return
    }

    // Set the access token
    mapboxgl.accessToken = token

    // Create the map with error handling
    try {
      const mapInstance = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12", // Use a default style to avoid rate limiting
        center: [54.5, 24.4],
        zoom: 11,
        maxZoom: 15, // Limit zoom to reduce tile requests
      })

      // Add error handling for map load
      mapInstance.on("error", (e) => {
        console.error("Mapbox error:", e)

        // Check for rate limiting errors
        if (e.error && (e.error.message || "").includes("Too Many Requests")) {
          setMapError("Mapbox rate limit exceeded. Please try again later.")
        } else {
          setMapError(`Map error: ${e.error?.message || "Unknown error"}`)
        }
      })

      mapInstance.on("load", () => {
        try {
          // Add polygon layer
          mapInstance.addSource("uae-polygon", {
            type: "geojson",
            data: {
              type: "Feature",
              geometry: {
                type: "Polygon",
                coordinates: [uaeCoordinates],
              },
            },
          })

          mapInstance.addLayer({
            id: "uae-polygon",
            type: "fill",
            source: "uae-polygon",
            layout: {},
            paint: {
              "fill-color": "#0080ff",
              "fill-opacity": 0.5,
            },
          })

          mapInstance.addLayer({
            id: "outline",
            type: "line",
            source: "uae-polygon",
            layout: {},
            paint: {
              "line-color": "#000",
              "line-width": 3,
            },
          })
        } catch (error) {
          console.error("Error adding map layers:", error)
          setMapError(`Error adding map layers: ${error.message}`)
        }
      })

      // Add click handler with error handling
      mapInstance.on("click", async (e) => {
        try {
          const { lng, lat } = e.lngLat

          // Insert data into Supabase
          const { data, error } = await supabase
            .from("locations")
            .insert([
              {
                name: `Location at ${lng.toFixed(4)}, ${lat.toFixed(4)}`,
                lat: lat,
                lng: lng,
              },
            ])
            .select()

          if (error) {
            console.error("Error inserting location:", error)
          } else {
            onSelectLocation(data[0])
          }

          mapInstance.flyTo({ center: [lng, lat], zoom: 15 })
        } catch (error) {
          console.error("Error handling map click:", error)
        }
      })

      map.current = mapInstance
      setMapInitialized(true)
    } catch (error) {
      console.error("Error initializing map:", error)
      setMapError(`Error initializing map: ${error.message}`)
    }

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [onSelectLocation, mapInitialized, token, loading, error])

  const addVideoMarker = (marker: Marker) => {
    if (!map.current) return

    try {
      const el = document.createElement("div")
      el.className = "video-marker"
      el.style.width = "100px"
      el.style.height = "100px"
      el.style.borderRadius = "50%"
      el.style.overflow = "hidden"
      el.style.border = "2px solid white"
      el.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.3)"

      const video = document.createElement("video")
      video.muted = true
      video.loop = true
      video.playsInline = true
      video.preload = "auto"
      video.style.width = "100%"
      video.style.height = "100%"
      video.style.objectFit = "cover"

      // Add error handling for video load
      video.onerror = () => {
        console.error(`Error loading video for marker: ${marker.name}`)
        // Show fallback image
        const fallbackImage = document.createElement("img")
        fallbackImage.src = "/placeholder.svg"
        fallbackImage.alt = marker.name
        fallbackImage.className = "w-full h-full object-cover"
        el.appendChild(fallbackImage)
      }

      // Add loading indicator
      const loadingIndicator = document.createElement("div")
      loadingIndicator.className = "absolute inset-0 flex items-center justify-center bg-black/50"
      loadingIndicator.innerHTML = `<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>`
      el.appendChild(loadingIndicator)

      // Create a blob URL for better performance
      const videoUrl = marker.videoUrl
      fetch(videoUrl)
        .then((response) => {
          if (!response.ok) throw new Error("Network response was not ok")
          return response.blob()
        })
        .then((blob) => {
          const blobUrl = URL.createObjectURL(blob)
          video.src = blobUrl
          video.onloadeddata = () => {
            URL.revokeObjectURL(blobUrl)
            loadingIndicator.remove()
            video.play().catch(console.error)
          }
        })
        .catch((error) => {
          console.error("Error loading video:", error)
          loadingIndicator.remove()
          // Show fallback image
          const fallbackImage = document.createElement("img")
          fallbackImage.src = "/placeholder.svg"
          fallbackImage.alt = marker.name
          fallbackImage.className = "w-full h-full object-cover"
          el.appendChild(fallbackImage)
        })

      el.appendChild(video)

      new mapboxgl.Marker(el).setLngLat([marker.lng, marker.lat]).addTo(map.current)
    } catch (error) {
      console.error("Error adding video marker:", error)
    }
  }

  return (
    <div className="relative w-full h-full">
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="bg-white p-4 rounded-md shadow-md max-w-md text-center">
            <h3 className="text-lg font-semibold text-red-600 mb-2">Map Error</h3>
            <p>{mapError}</p>
            <p className="mt-2 text-sm text-gray-600">
              This could be due to rate limiting or network issues. Please try again later.
            </p>
          </div>
        </div>
      )}
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  )
}
