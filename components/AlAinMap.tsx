"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { useMapboxToken } from "@/hooks/useMapboxToken"

const ALWAYS_VISIBLE_MARKERS = [
  "مركز شرطة الوقن",
  "مركز شرطة هيلي",
  "مركز شرطة المعترض",
  "مركز شرطة الجاهلي",
  "مركز شرطة الطوية",
  "مركز شرطة الخزنة",
  "مركز شرطة الفوعة",
  "مركز شرطة الهير",
  "مركز شرطة الصاروج",
  "مركز شرطة الرماح",
  "مركز شرطة الشويب",
  "مركز شرطة الحفة",
  "مركز شرطة الحيل",
  "مركز شرطة الخالدية",
  "مركز شرطة الجيمي",
  "مركز شرطة الصدر",
  "مركز شرطة الشهامة",
  "مركز شرطة الكرامة",
  "مركز شرطة الجبل الأخضر",
  "مركز شرطة الحصن",
  "مركز شرطة الحديقة",
  "مركز شرطة الجرف",
  "مركز شرطة الحيرة",
  "مركز شرطة الحلة",
  "مركز شرطة الحوية",
  "مركز شرطة الحويلة",
  "مركز شرطة الحوطة",
  "مركز شرطة الحوقين",
  "مركز شرطة الحوض",
  "مركز شرطة الحوشي",
  "مركز شرطة الحوامد",
  "مركز شرطة الحوارث",
  "مركز شرطة الحوافر",
  "مركز شرطة الحوالي",
  "مركز شرطة الحوانيت",
  "مركز شرطة الحوايا",
  "مركز شرطة الحوايج",
  "مركز شرطة الحوايل",
  "مركز شرطة الحوايم",
  "مركز شرطة الحواين",
  "مركز شرطة الحوايه",
  "مركز شرطة الحوايو",
  "مركز شرطة الحوايي",
  "مركز شرطة الحوايك",
]

const labeledMarkers = [
  { name: "مركز شرطة هيلي", position: "position-7" },
  { name: "ساحة حجز المركبات - الساد", position: "position-3" },
]

const labeledMarkersArray = ["مركز شرطة هيلي", "ساحة حجز المركبات - الساد"]

interface AlAinMapProps {
  onProjectSelect?: (project: any) => void
  selectedProject?: any
  filterType?: string
  onMarkerHover?: (project: any) => void
}

export default function AlAinMap({
  onProjectSelect,
  selectedProject,
  filterType = "all",
  onMarkerHover,
}: AlAinMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)
  const { token, loading, error } = useMapboxToken()
  const [markers, setMarkers] = useState<{ [key: string]: mapboxgl.Marker }>({})
  const [policeData, setPoliceData] = useState<any[]>([])

  useEffect(() => {
    const loadPoliceData = async () => {
      try {
        const response = await fetch("/data/police_locations.json")
        const data = await response.json()
        setPoliceData(data)
      } catch (err) {
        console.error("Error loading police data:", err)
      }
    }
    loadPoliceData()
  }, [])

  useEffect(() => {
    if (map.current) return // already initialized
    if (loading) return
    if (error || !token) {
      setMapError("Mapbox access token error: " + (error || "Token not available"))
      return
    }

    try {
      console.log("Initializing Al Ain map with token:", token.substring(0, 5) + "...")
      mapboxgl.accessToken = token

      map.current = new mapboxgl.Map({
        container: mapContainer.current!,
        style: "mapbox://styles/mapbox/satellite-streets-v12",
        center: [55.7558, 24.2084], // Al Ain coordinates
        zoom: 11,
        pitch: 30,
        bearing: 0,
        preserveDrawingBuffer: true,
        renderWorldCopies: false,
      })

      map.current.on("load", () => {
        console.log("Al Ain map loaded successfully")
        setMapLoaded(true)
      })

      map.current.on("error", (e) => {
        console.error("Mapbox error:", e)
        const errorMessage = e.error?.message || e.message || "Unknown error"
        setMapError(`Map error: ${errorMessage}`)
      })
    } catch (err) {
      console.error("Error initializing map:", err)
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      setMapError(`Failed to initialize map: ${errorMessage}`)
    }

    return () => {
      try {
        if (map.current) {
          console.log("Cleaning up Al Ain map")
          map.current.remove()
          map.current = null
        }
      } catch (err) {
        console.error("Error during map cleanup:", err)
      }
    }
  }, [token, loading, error])

  useEffect(() => {
    if (!map.current || !mapLoaded || policeData.length === 0) return

    Object.values(markers).forEach((marker) => marker.remove())

    const newMarkers: { [key: string]: mapboxgl.Marker } = {}

    policeData.forEach((location) => {
      const markerEl = document.createElement("div")
      markerEl.className = "police-marker"
      markerEl.innerHTML = `
        <div class="marker-container">
          <div class="marker-pulse"></div>
          <div class="marker-dot"></div>
        </div>
      `

      const marker = new mapboxgl.Marker({
        element: markerEl,
        anchor: "center",
      })
        .setLngLat([location.longitude, location.latitude])
        .addTo(map.current!)

      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 25,
        className: "police-popup",
      }).setHTML(`
        <div class="popup-content">
          <h3>${location.name}</h3>
          <p>Police Station</p>
        </div>
      `)

      markerEl.addEventListener("mouseenter", () => {
        marker.setPopup(popup).togglePopup()
        if (onMarkerHover) onMarkerHover(location)
      })

      markerEl.addEventListener("mouseleave", () => {
        marker.getPopup().remove()
        if (onMarkerHover) onMarkerHover(null)
      })

      markerEl.addEventListener("click", () => {
        if (onProjectSelect) {
          onProjectSelect(location)
          map.current!.flyTo({
            center: [location.longitude, location.latitude],
            zoom: 15,
            pitch: 45,
            bearing: 30,
            duration: 1500,
            essential: true,
          })
        }
      })

      newMarkers[location.name] = marker
    })

    setMarkers(newMarkers)
  }, [mapLoaded, policeData, onMarkerHover, onProjectSelect])

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

      <style jsx global>{`
        .police-marker {
          width: 20px;
          height: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          will-change: transform, opacity;
        }
        
        .marker-container {
          position: relative;
          width: 100%;
          height: 100%;
        }
        
        .marker-dot {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 10px;
          height: 10px;
          background-color: #1B1464;
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
          z-index: 2;
        }
        
        .marker-pulse {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 20px;
          height: 20px;
          background-color: rgba(27, 20, 100, 0.4);
          border-radius: 50%;
          z-index: 1;
          animation: pulse 2s infinite;
          animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform, opacity;
        }
        
        .police-popup {
          max-width: 200px;
          background: rgba(0, 0, 0, 0.8);
          border-radius: 8px;
          padding: 0;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .popup-content {
          padding: 10px;
          color: white;
        }
        
        .popup-content h3 {
          margin: 0 0 5px 0;
          font-size: 14px;
          font-weight: bold;
        }
        
        .popup-content p {
          margin: 0;
          font-size: 12px;
          opacity: 0.8;
        }
        
        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0.8;
          }
          70% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0;
          }
          100% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
