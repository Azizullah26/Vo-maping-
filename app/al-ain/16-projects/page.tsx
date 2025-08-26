"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, ArrowLeft } from "lucide-react"
import { useMapboxToken } from "@/hooks/useMapboxToken"

// Declare mapboxgl as a global variable
declare global {
  interface Window {
    mapboxgl: any
  }
}

// Enhanced marker styles with circular label positioning and mask overlay
const markerStyles = `
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
}

.map-mask-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/images/mask-dark.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.6;
  z-index: 5;
  pointer-events: none;
  mix-blend-mode: multiply;
}

.marker-container {
  position: absolute !important;
  transform: translate(-50%, -50%);
  z-index: 10;
  pointer-events: auto;
  width: 3rem;
  height: 3.5rem;
}

@media (min-width: 640px) {
  .marker-container {
    width: 3.5rem;
    height: 3.5rem;
  }
}

@media (min-width: 768px) {
  .marker-container {
    width: 4rem;
    height: 4rem;
  }
}

.marker-circle {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 0.75rem;
  height: 0.75rem;
  background-color: #ffffff;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
  transform: translate(-50%, -50%);
  transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
  z-index: 12;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s infinite;
}

@media (min-width: 640px) {
  .marker-circle {
    width: 0.875rem;
    height: 0.875rem;
  }
}

@media (min-width: 768px) {
  .marker-circle {
    width: 0.9375rem;
    height: 0.9375rem;
  }
}

.marker-vector {
  position: absolute;
  transition: all 0.3s ease;
  z-index: 13;
  pointer-events: none;
}

.marker-shadow {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 2rem;
  height: 2rem;
  background-image: url('/images/mask-dark.png');
  background-size: cover;
  background-position: center;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.8;
  z-index: 8;
  filter: blur(4px);
}

@media (min-width: 640px) {
  .marker-shadow {
    width: 2.5rem;
    height: 2.5rem;
  }
}

@media (min-width: 768px) {
  .marker-shadow {
    width: 3rem;
    height: 3rem;
  }
}

/* Circular label positioning - no overlapping */
.marker-label {
  position: absolute;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #1a1a1a;
  white-space: nowrap;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(8px);
  font-family: 'Inter', sans-serif;
  z-index: 14;
  min-width: 120px;
  text-align: center;
}

.marker-label:hover {
  background: rgba(255, 255, 255, 1);
  color: #0ea5e9;
  border-color: #0ea5e9;
  box-shadow: 0 4px 16px rgba(14, 165, 233, 0.2);
  transform: scale(1.02);
}

/* Strategic positioning system - like real estate development labels */
/* Position 1: Top-Left (clean offset) */
.marker-container.position-1 .marker-label {
  bottom: calc(100% + 25px);
  right: calc(100% + 15px);
  transform: none;
}

/* Position 2: Top-Right (clean offset) */
.marker-container.position-2 .marker-label {
  bottom: calc(100% + 25px);
  left: calc(100% + 15px);
  transform: none;
}

/* Position 3: Right (clean side) */
.marker-container.position-3 .marker-label {
  top: 50%;
  left: calc(100% + 25px);
  transform: translateY(-50%);
}

/* Position 4: Bottom-Right (clean offset) */
.marker-container.position-4 .marker-label {
  top: calc(100% + 25px);
  left: calc(100% + 15px);
  transform: none;
}

/* Position 5: Bottom (clean below) */
.marker-container.position-5 .marker-label {
  top: calc(100% + 25px);
  left: 50%;
  transform: translateX(-50%);
}

/* Position 6: Bottom-Left (clean offset) */
.marker-container.position-6 .marker-label {
  top: calc(100% + 25px);
  right: calc(100% + 15px);
  transform: none;
}

/* Position 7: Left (clean side) */
.marker-container.position-7 .marker-label {
  top: 50%;
  right: calc(100% + 25px);
  transform: translateY(-50%);
}

/* Position 8: Top (clean above) */
.marker-container.position-8 .marker-label {
  bottom: calc(100% + 25px);
  left: 50%;
  transform: translateX(-50%);
}

/* Clean connecting lines - minimalist style like in screenshot */
.marker-line {
  position: absolute;
  background: rgba(255, 255, 255, 0.6);
  transition: all 0.3s ease;
  z-index: 11;
}

/* Top-Left line */
.marker-container.position-1 .marker-line {
  right: 100%;
  bottom: 100%;
  width: 25px;
  height: 25px;
  border-top: 1px solid rgba(255, 255, 255, 0.6);
  border-right: 1px solid rgba(255, 255, 255, 0.6);
  background: none;
}

/* Top-Right line */
.marker-container.position-2 .marker-line {
  left: 100%;
  bottom: 100%;
  width: 25px;
  height: 25px;
  border-top: 1px solid rgba(255, 255, 255, 0.6);
  border-left: 1px solid rgba(255, 255, 255, 0.6);
  background: none;
}

/* Right line */
.marker-container.position-3 .marker-line {
  left: 100%;
  top: 50%;
  width: 25px;
  height: 1px;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.6);
}

/* Bottom-Right line */
.marker-container.position-4 .marker-line {
  left: 100%;
  top: 100%;
  width: 25px;
  height: 25px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.6);
  border-left: 1px solid rgba(255, 255, 255, 0.6);
  background: none;
}

/* Bottom line */
.marker-container.position-5 .marker-line {
  left: 50%;
  top: 100%;
  width: 1px;
  height: 25px;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.6);
}

/* Bottom-Left line */
.marker-container.position-6 .marker-line {
  right: 100%;
  top: 100%;
  width: 25px;
  height: 25px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.6);
  border-right: 1px solid rgba(255, 255, 255, 0.6);
  background: none;
}

/* Left line */
.marker-container.position-7 .marker-line {
  right: 100%;
  top: 50%;
  width: 25px;
  height: 1px;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.6);
}

/* Top line */
.marker-container.position-8 .marker-line {
  left: 50%;
  bottom: 100%;
  width: 1px;
  height: 25px;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.6);
}

.marker-container:hover .marker-line {
  background: rgba(14, 165, 233, 0.8);
  border-color: rgba(14, 165, 233, 0.8);
}

.marker-container:hover .marker-circle {
  transform: translate(-50%, -50%) scale(1.1);
}

.marker-container:hover .marker-shadow {
  opacity: 1.0;
  transform: translate(-50%, -50%) scale(1.2);
}

.mapboxgl-ctrl-bottom-right { display: none !important; }

/* Responsive adjustments for clean positioning */
@media (max-width: 768px) {
  .marker-label {
    font-size: 11px;
    padding: 4px 8px;
    min-width: 100px;
  }

  /* Reduce distances for mobile */
  .marker-container.position-1 .marker-label {
    bottom: calc(100% + 20px);
    right: calc(100% + 10px);
  }

  .marker-container.position-2 .marker-label {
    bottom: calc(100% + 20px);
    left: calc(100% + 10px);
  }

  .marker-container.position-3 .marker-label {
    left: calc(100% + 20px);
  }

  .marker-container.position-4 .marker-label {
    top: calc(100% + 20px);
    left: calc(100% + 10px);
  }

  .marker-container.position-5 .marker-label {
    top: calc(100% + 20px);
  }

  .marker-container.position-6 .marker-label {
    top: calc(100% + 20px);
    right: calc(100% + 10px);
  }

  .marker-container.position-7 .marker-label {
    right: calc(100% + 20px);
  }

  .marker-container.position-8 .marker-label {
    bottom: calc(100% + 20px);
  }

  /* Shorter connection lines for mobile */
  .marker-container.position-1 .marker-line,
  .marker-container.position-2 .marker-line,
  .marker-container.position-4 .marker-line,
  .marker-container.position-6 .marker-line {
    width: 20px;
    height: 20px;
  }

  .marker-container.position-3 .marker-line,
  .marker-container.position-7 .marker-line {
    width: 20px;
  }

  .marker-container.position-5 .marker-line,
  .marker-container.position-8 .marker-line {
    height: 20px;
  }
}

@media (max-width: 640px) {
  .marker-label {
    font-size: 10px;
    padding: 3px 6px;
    min-width: 80px;
  }

  /* Further reduce distances for small mobile */
  .marker-container.position-1 .marker-label {
    bottom: calc(100% + 15px);
    right: calc(100% + 8px);
  }

  .marker-container.position-2 .marker-label {
    bottom: calc(100% + 15px);
    left: calc(100% + 8px);
  }

  .marker-container.position-3 .marker-label {
    left: calc(100% + 15px);
  }

  .marker-container.position-4 .marker-label {
    top: calc(100% + 15px);
    left: calc(100% + 8px);
  }

  .marker-container.position-5 .marker-label {
    top: calc(100% + 15px);
  }

  .marker-container.position-6 .marker-label {
    top: calc(100% + 15px);
    right: calc(100% + 8px);
  }

  .marker-container.position-7 .marker-label {
    right: calc(100% + 15px);
  }

  .marker-container.position-8 .marker-label {
    bottom: calc(100% + 15px);
  }

  /* Even shorter connection lines for small mobile */
  .marker-container.position-1 .marker-line,
  .marker-container.position-2 .marker-line,
  .marker-container.position-4 .marker-line,
  .marker-container.position-6 .marker-line {
    width: 15px;
    height: 15px;
  }

  .marker-container.position-3 .marker-line,
  .marker-container.position-7 .marker-line {
    width: 15px;
  }

  .marker-container.position-5 .marker-line,
  .marker-container.position-8 .marker-line {
    height: 15px;
  }
}
`

// Location data with Pentagon-style directional configurations and SVG icons
interface LocationFeature {
  place: string
  coordinates: [number, number]
  direction:
    | "position-1"
    | "position-2"
    | "position-3"
    | "position-4"
    | "position-5"
    | "position-6"
    | "position-7"
    | "position-8"
  vectorIcon: string
  vectorSize: { width: number; height: number }
  vectorPosition: { top: number; left: number }
}

const locationData: LocationFeature[] = [
  {
    place: "ادارة المهام الخاصة العين",
    coordinates: [55.724096640469895, 24.1956108396531],
    direction: "position-1", // Top
    vectorIcon: "/vector-21.svg",
    vectorSize: { width: 56, height: 56 },
    vectorPosition: { top: -28, left: -28 },
  },
  {
    place: "مركز شرطة فلج هزاع",
    coordinates: [55.72710955627929, 24.19954145588217],
    direction: "position-2", // Top-Right
    vectorIcon: "/vector-35.svg",
    vectorSize: { width: 37, height: 26 },
    vectorPosition: { top: -35, left: -18 },
  },
  {
    place: "إدارة المرور والترخيص",
    coordinates: [55.727851797240874, 24.19304931881034],
    direction: "position-3", // Right
    vectorIcon: "/vector-24.svg",
    vectorSize: { width: 38, height: 17 },
    vectorPosition: { top: -25, left: -19 },
  },
  {
    place: "قسم هندسة المرور",
    coordinates: [55.7225168640654, 24.19328471799456],
    direction: "position-4", // Bottom-Right
    vectorIcon: "/vector-26.svg",
    vectorSize: { width: 20, height: 17 },
    vectorPosition: { top: -22, left: -10 },
  },
  {
    place: "المتابعة الشرطية والرعاية اللاحقة",
    coordinates: [55.722557288830416, 24.19360483409058],
    direction: "position-5", // Bottom
    vectorIcon: "/vector-31.svg",
    vectorSize: { width: 35, height: 35 },
    vectorPosition: { top: -30, left: -17 },
  },
  {
    place: "إدارة الأسلحة والمتفجرات",
    coordinates: [55.72427804325733, 24.19797500690261],
    direction: "position-6", // Bottom-Left
    vectorIcon: "/vector-43.svg",
    vectorSize: { width: 21, height: 30 },
    vectorPosition: { top: -28, left: -10 },
  },
  {
    place: "فلل فلج هزاع",
    coordinates: [55.72680131200215, 24.186317410709492],
    direction: "position-7", // Left
    vectorIcon: "/vector-32.svg",
    vectorSize: { width: 6, height: 42 },
    vectorPosition: { top: -34, left: -3 },
  },
  {
    place: "الضبط المروري والمراسم",
    coordinates: [55.7286784476679, 24.191336582641284],
    direction: "position-8", // Top-Left
    vectorIcon: "/vector-36.svg",
    vectorSize: { width: 35, height: 36 },
    vectorPosition: { top: -31, left: -17 },
  },
  {
    place: "إدارة الدوريات الخاصة",
    coordinates: [55.723325119991586, 24.191513430459977],
    direction: "position-1", // Top
    vectorIcon: "/vector-27.svg",
    vectorSize: { width: 6, height: 32 },
    vectorPosition: { top: -29, left: -3 },
  },
  {
    place: "قسم التفتيش الأمني K9",
    coordinates: [55.72352938898794, 24.18905139894737],
    direction: "position-2", // Top-Right
    vectorIcon: "/vector-42.svg",
    vectorSize: { width: 35, height: 17 },
    vectorPosition: { top: -22, left: -17 },
  },
  {
    place: "سكن أفراد المرور",
    coordinates: [55.724324255872546, 24.193154596995498],
    direction: "position-3", // Right
    vectorIcon: "/vector-30.svg",
    vectorSize: { width: 6, height: 30 },
    vectorPosition: { top: -28, left: -3 },
  },
  {
    place: "ساحة حجز المركبات فلج هزاع",
    coordinates: [55.726040750462175, 24.19089476054195],
    direction: "position-4", // Bottom-Right
    vectorIcon: "/vector-48.svg",
    vectorSize: { width: 30, height: 60 },
    vectorPosition: { top: -43, left: -15 },
  },
  {
    place: "مبنى التحريات والمخدرات",
    coordinates: [55.71923885266557, 24.196245342189755],
    direction: "position-5", // Bottom
    vectorIcon: "/vector-51.svg",
    vectorSize: { width: 54, height: 48 },
    vectorPosition: { top: -37, left: -27 },
  },
]

// Constants
const INITIAL_CENTER: [number, number] = [55.72043546440918, 24.192517454170684]
const ZOOM_LEVEL = 13.5
const MIN_ZOOM = 12
const MAX_ZOOM = 18

// Helper functions from AlAinMap
function areCoordinatesEqual(coord1: [number, number], coord2: [number, number], tolerance = 0.0001): boolean {
  return Math.abs(coord1[0] - coord2[0]) < tolerance && Math.abs(coord1[1] - coord2[1]) < tolerance
}

function isValidCoordinate(coord: [number, number]): boolean {
  return (
    Array.isArray(coord) &&
    coord.length === 2 &&
    typeof coord[0] === "number" &&
    typeof coord[1] === "number" &&
    !isNaN(coord[0]) &&
    !isNaN(coord[1])
  )
}

export default function SixteenProjectsPage() {
  const router = useRouter()
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<any>(null)
  const markersRef = useRef<{ [key: string]: any }>({})
  const [mapboxLoaded, setMapboxLoaded] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<LocationFeature | null>(null)
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null)
  const [clickedMarker, setClickedMarker] = useState<string | null>(null)
  const { token, loading, error } = useMapboxToken()
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Optimized navigation handler
  const handleLocationClick = useCallback(
    (location: LocationFeature) => {
      setSelectedLocation(location)
      const dashboardId = `al-ain-facility-${Date.now()}`
      router.push(
        `/dashboard/${dashboardId}?name=${encodeURIComponent(location.place)}&type=police-facility&lat=${location.coordinates[1]}&lng=${location.coordinates[0]}`,
      )
    },
    [router],
  )

  // Optimized map click handler
  const handleMapClick = useCallback(() => {
    setSelectedLocation(null)
    setHoveredLocation(null)
    setClickedMarker(null)

    Object.entries(markersRef.current).forEach(([_, marker]) => {
      const element = marker.getElement()
      element.classList.remove("marker-dimmed")
      element.classList.remove("marker-highlighted")
      element.style.opacity = ""
      element.style.zIndex = ""
      element.style.filter = ""
    })
  }, [])

  const debouncedUpdateMarkers = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      if (!mapRef.current) return

      Object.entries(markersRef.current).forEach(([name, marker]) => {
        try {
          const position = marker.getLngLat()
          if (position) {
            const element = marker.getElement()
            if (element.style.display !== "none") {
              marker.setLngLat(position)
            }
          }
        } catch (error) {
          console.error(`Error updating marker position for ${name}:`, error)
        }
      })
    }, 100)
  }

  // Load Mapbox GL JS and CSS from CDN - optimized
  useEffect(() => {
    if (typeof window === "undefined" || window.mapboxgl) {
      if (window.mapboxgl) setMapboxLoaded(true)
      return
    }

    const loadMapbox = () => {
      // Load CSS
      const cssLink = document.createElement("link")
      cssLink.rel = "stylesheet"
      cssLink.href = `https://api.mapbox.com/mapbox-gl-js/v3.7.0/mapbox-gl.css?t=${Date.now()}`
      document.head.appendChild(cssLink)

      // Load JS
      const script = document.createElement("script")
      script.src = `https://api.mapbox.com/mapbox-gl-js/v3.7.0/mapbox-gl.js?t=${Date.now()}`
      script.onload = () => setMapboxLoaded(true)
      script.onerror = () => console.error("Failed to load Mapbox GL JS")
      document.head.appendChild(script)

      return () => {
        try {
          if (document.head.contains(cssLink)) document.head.removeChild(cssLink)
          if (document.head.contains(script)) document.head.removeChild(script)
        } catch (e) {
          console.warn("Cleanup error:", e)
        }
      }
    }

    return loadMapbox()
  }, [])

  // Add marker styles - optimized
  useEffect(() => {
    const styleEl = document.createElement("style")
    styleEl.textContent = markerStyles
    document.head.appendChild(styleEl)
    return () => styleEl.remove()
  }, [])

  // Initialize map - optimized
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current || loading || error || !token || !mapboxLoaded || !window.mapboxgl) {
      if (error) console.error("Mapbox token error:", error)
      return
    }

    try {
      window.mapboxgl.accessToken = token

      mapRef.current = new window.mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/azizullah2611/cm6okbhyo000301qz5q58gdud",
        center: INITIAL_CENTER,
        zoom: ZOOM_LEVEL,
        pitch: 0,
        bearing: 0,
        minZoom: MIN_ZOOM,
        maxZoom: MAX_ZOOM,
        renderWorldCopies: false,
        attributionControl: false,
        trackResize: true,
        interactive: true,
        doubleClickZoom: true,
      })

      // Enable interactions
      mapRef.current.scrollZoom.enable()
      mapRef.current.dragPan.enable()
      mapRef.current.touchZoomRotate.enable()

      // Map load handler
      mapRef.current.on("load", () => {
        setMapLoaded(true)
        mapRef.current.getCanvas().style.filter = "contrast(1.15) saturate(1.2) brightness(0.95)"
      })

      // Zoom event handler
      mapRef.current.on("zoom", () => {
        try {
          debouncedUpdateMarkers()
        } catch (error) {
          console.error("Error handling zoom event:", error)
        }
      })

      // Click handler
      mapRef.current.on("click", handleMapClick)

      return () => {
        try {
          if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current)
          }

          if (mapRef.current) {
            try {
              mapRef.current.off()
              mapRef.current.stop()
              mapRef.current.setStyle({
                version: 8,
                sources: {},
                layers: [],
              })

              setTimeout(() => {
                try {
                  if (mapRef.current) {
                    mapRef.current.remove()
                    mapRef.current = null
                  }
                } catch (e) {
                  console.warn("Map already removed or error during removal:", e)
                }
              }, 50)
            } catch (e) {
              try {
                mapRef.current.remove()
                mapRef.current = null
              } catch (removeError) {
                console.warn("Error during map removal:", removeError)
              }
            }
          }

          document.querySelectorAll("style[data-marker-style]").forEach((el) => el.remove())
        } catch (error) {
          console.error("Error cleaning up map:", error)
        }
      }
    } catch (e) {
      console.error("Map initialization error:", e)
    }
  }, [mapboxLoaded, token, loading, error, handleMapClick])

  // Create markers with fixed positioning exactly like AlAinMap - removed tooltip functionality
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => marker?.remove?.())
    markersRef.current = {}

    // Create markers using the same structure as AlAinMap
    const markers: { [key: string]: any } = {}

    locationData.forEach((location) => {
      try {
        if (!isValidCoordinate(location.coordinates)) {
          console.error(`Invalid coordinates for ${location.place}:`, location.coordinates)
          return
        }

        markers[location.place] = createMarker({
          name: location.place,
          coordinates: location.coordinates,
          direction: location.direction,
          vectorIcon: location.vectorIcon,
          vectorSize: location.vectorSize,
          vectorPosition: location.vectorPosition,
          map: mapRef.current!,
        })
      } catch (error) {
        console.error(`Error creating marker for ${location.place}:`, error)
      }
    })

    markersRef.current = markers

    return () => {
      try {
        Object.values(markers).forEach((marker) => marker?.remove?.())
      } catch (e) {
        console.warn("Marker cleanup error:", e)
      }
    }
  }, [mapLoaded, handleLocationClick])

  function createMarker({
    name,
    coordinates,
    direction,
    vectorIcon,
    vectorSize,
    vectorPosition,
    map,
  }: {
    name: string
    coordinates: [number, number]
    direction: string
    vectorIcon: string
    vectorSize: { width: number; height: number }
    vectorPosition: { top: number; left: number }
    map: any
  }) {
    try {
      if (!isValidCoordinate(coordinates)) {
        console.error(`Invalid coordinates for marker ${name}:`, coordinates)
        throw new Error(`Invalid coordinates for marker ${name}`)
      }

      const markerElement = document.createElement("div")
      markerElement.className = `marker-container ${direction}`
      markerElement.style.position = "absolute"
      markerElement.style.pointerEvents = "auto"
      markerElement.style.willChange = "transform"

      // Add responsive classes
      markerElement.classList.add("w-12", "h-12", "sm:w-14", "sm:h-14", "md:w-16", "md:h-16")

      // Create marker shadow using mask image
      const shadow = document.createElement("div")
      shadow.className = "marker-shadow"

      // Create connecting line (dotted line from circle to label)
      const line = document.createElement("div")
      line.className = "marker-line"

      // Create circle
      const circleElement = document.createElement("div")
      circleElement.className = "marker-circle"

      // Create SVG vector icon
      const vector = document.createElement("img")
      vector.src = vectorIcon
      vector.className = "marker-vector"
      vector.style.width = `${vectorSize.width}px`
      vector.style.height = `${vectorSize.height}px`
      vector.style.top = `${vectorPosition.top}px`
      vector.style.left = `${vectorPosition.left}px`
      vector.alt = "Marker icon"
      vector.onerror = () => {
        console.warn(`Failed to load SVG: ${vectorIcon}`)
        vector.style.display = "none"
      }

      // Create label
      const label = document.createElement("button")
      label.className = "marker-label"
      label.textContent = name
      label.setAttribute("aria-label", name)

      // Event handlers - removed tooltip functionality
      markerElement.addEventListener("mouseenter", (e) => {
        e.stopPropagation()
        setHoveredLocation(name)

        Object.entries(markersRef.current).forEach(([markerName, marker]) => {
          const element = marker.getElement()
          if (markerName !== name) {
            element.classList.add("marker-dimmed")
            element.style.opacity = "0.2"
          } else {
            element.classList.add("marker-highlighted")
            element.style.opacity = "1"
            element.style.zIndex = "1000"
            element.style.filter = "drop-shadow(0 0 8px rgba(0, 204, 255, 0.8))"
          }
        })
      })

      markerElement.addEventListener("mouseleave", (e) => {
        e.stopPropagation()
        if (clickedMarker !== name) {
          setHoveredLocation(null)

          Object.entries(markersRef.current).forEach(([_, marker]) => {
            const element = marker.getElement()
            element.classList.remove("marker-dimmed")
            element.classList.remove("marker-highlighted")
            element.style.opacity = ""
            element.style.zIndex = ""
            element.style.filter = ""
          })
        }
      })

      markerElement.addEventListener("click", (e) => {
        e.stopPropagation()
        setHoveredLocation(name)
        setClickedMarker(name)

        const location = locationData.find((loc) => loc.place === name)
        if (location) {
          handleLocationClick(location)
        }

        Object.entries(markersRef.current).forEach(([markerName, marker]) => {
          const element = marker.getElement()
          if (markerName !== name) {
            element.classList.add("marker-dimmed")
            element.style.opacity = "0.2"
          } else {
            element.classList.add("marker-highlighted")
            element.style.opacity = "1"
            element.style.zIndex = "1000"
            element.style.filter = "drop-shadow(0 0 8px rgba(0, 204, 255, 0.8))"
          }
        })
      })

      // Append elements in correct z-index order
      markerElement.appendChild(shadow)
      markerElement.appendChild(line)
      markerElement.appendChild(circleElement)
      markerElement.appendChild(vector)
      markerElement.appendChild(label)
      markerElement.setAttribute("data-marker-name", name)

      const marker = new window.mapboxgl.Marker({
        element: markerElement,
        anchor: "center",
        offset: [0, 0],
        pitchAlignment: "map",
        rotationAlignment: "map",
      })
        .setLngLat(coordinates)
        .addTo(map)

      return marker
    } catch (error) {
      console.error(`Error creating marker for ${name}:`, error)
      throw error
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.08),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(59,130,246,0.05)_60deg,transparent_120deg)] pointer-events-none" />

      {/* Back Button */}
      <Button
        onClick={() => router.back()}
        variant="outline"
        size="sm"
        className="absolute top-6 left-6 z-50 border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 bg-slate-900/50 backdrop-blur-sm"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="flex h-screen">
        {/* Map Area */}
        <div className="flex-1 relative">
          <div ref={mapContainerRef} className="relative w-full h-full overflow-hidden" />

          {/* Map Mask Overlay */}
          <div className="map-mask-overlay" />

          <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-900/30 via-slate-800/10 to-transparent pointer-events-none" />
        </div>

        {/* Mobile Bottom Panel */}
        {selectedLocation && (
          <div className="md:hidden absolute bottom-0 left-0 right-0 z-40">
            <Card className="m-4 bg-gradient-to-br from-slate-800/95 to-blue-900/95 border-2 border-cyan-400/30 shadow-xl shadow-cyan-400/20 backdrop-blur-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-cyan-400 mb-1">{selectedLocation.place}</CardTitle>
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {selectedLocation.coordinates[0].toFixed(6)}, {selectedLocation.coordinates[1].toFixed(6)}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => setSelectedLocation(null)}
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-white"
                    aria-label="Close"
                  >
                    ×
                  </Button>
                </div>
                <div className="mt-2">
                  <Badge variant="outline" className="text-xs border-cyan-400/30 text-cyan-300">
                    Police Facility
                  </Badge>
                </div>
                <div className="mt-3">
                  <Button
                    onClick={() => handleLocationClick(selectedLocation)}
                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
                    size="sm"
                  >
                    View Dashboard
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
