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

// Enhanced marker styles with circular label positioning
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

.marker-label {
  position: absolute;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 25px;
  font-size: 14px;
  font-weight: 600;
  color: #000;
  white-space: nowrap;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  font-family: 'Inter', sans-serif;
  z-index: 14;
}

.marker-label:hover {
  background: rgba(0, 0, 0, 0.9);
  color: #fff;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.3), 0 8px 24px rgba(0, 0, 0, 0.3);
  transform: scale(1.05);
}

/* Single dotted line connecting to center point */
.marker-line {
  position: absolute;
  width: 2px;
  background: linear-gradient(0deg, #ffffff 50%, transparent 50%);
  background-size: 2px 6px;
  background-repeat: repeat-y;
  z-index: 9;
  transform-origin: bottom center;
}

.marker-container:hover .marker-line {
  background: linear-gradient(0deg, rgba(0, 204, 255, 0.8) 50%, transparent 50%);
}

.marker-container:hover .marker-circle {
  transform: translate(-50%, -50%) scale(1.1);
}

.marker-container:hover .marker-shadow {
  opacity: 1.0;
  transform: translate(-50%, -50%) scale(1.2);
}

.mapboxgl-ctrl-bottom-right { display: none !important; }

@media (max-width: 768px) {
  .marker-label {
    font-size: 12px;
    padding: 6px 12px;
  }
}

@media (max-width: 640px) {
  .marker-label {
    font-size: 11px;
    padding: 4px 8px;
  }
}
`

interface LocationFeature {
  place: string
  coordinates: [number, number]
}

const locations: LocationFeature[] = [
  {
    place: "ادارة المهام الخاصة العين",
    coordinates: [55.724096640469895, 24.1956108396531],
  },
  {
    place: "مركز شرطة فلج هزاع",
    coordinates: [55.72710955627929, 24.19954145588217],
  },
  {
    place: "إدارة المرور والترخيص",
    coordinates: [55.727851797240874, 24.19304931881034],
  },
  {
    place: "قسم هندسة المرور",
    coordinates: [55.7225168640654, 24.19328471799456],
  },
  {
    place: "المتابعة الشرطية والرعاية اللاحقة",
    coordinates: [55.722557288830416, 24.19360483409058],
  },
  {
    place: "إدارة الأسلحة والمتفجرات",
    coordinates: [55.72427804325733, 24.19797500690261],
  },
  {
    place: "فلل فلج هزاع",
    coordinates: [55.72680131200215, 24.186317410709492],
  },
  {
    place: "الضبط المروري والمراسم",
    coordinates: [55.7286784476679, 24.191336582641284],
  },
  {
    place: "إدارة الدوريات الخاصة",
    coordinates: [55.723325119991586, 24.191513430459977],
  },
  {
    place: "قسم التفتيش الأمني K9",
    coordinates: [55.72352938898794, 24.18905139894737],
  },
  {
    place: "سكن أفراد المرور",
    coordinates: [55.724324255872546, 24.193154596995498],
  },
  {
    place: "ساحة حجز المركبات فلج هزاع",
    coordinates: [55.726040750462175, 24.19089476054195],
  },
  {
    place: "مبنى التحريات والمخدرات",
    coordinates: [55.71923885266557, 24.196245342189755],
  },
]

const manualLabelOffsets: Record<string, { left?: number; top?: number }> = {
  "ادارة المهام الخاصة العين": { left: 283 },
  "مركز شرطة فلج هزاع": { left: 13, top: -139 },
  "إدارة المرور والترخيص": { left: 240, top: 171 },
  "قسم هندسة المرور": { left: 354, top: 83 },
  "المتابعة الشرطية والرعاية اللاحقة": { left: -161, top: 163 },
  "إدارة الأسلحة والمتفجرات": { left: -130, top: -99 },
  "فلل فلج هزاع": { left: -100, top: 127 },
  "الضبط المروري والمراسم": { left: -321 },
  "إدارة الدوريات الخاصة": { left: -273 },
  "قسم التفتيش الأمني K9": { left: 196, top: 165 },
  "سكن أفراد المرور": { left: 226, top: -178 },
  "ساحة حجز المركبات فلج هزاع": { left: 301 },
  "مبنى التحريات والمخدرات": { left: -160, top: -41 },
}

const CENTER_POINT: [number, number] = [55.72443, 24.1925] // Central point of all facilities
const LABEL_RADIUS = 0.003 // Distance from center to labels (~300m)

const INITIAL_CENTER: [number, number] = [55.72043546440918, 24.192517454170684]
const ZOOM_LEVEL = 13.5
const MIN_ZOOM = 12
const MAX_ZOOM = 18

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

function getRadialPosition(index: number, total: number): [number, number] {
  const angle = ((2 * Math.PI) / total) * index
  const lng = CENTER_POINT[0] + LABEL_RADIUS * Math.cos(angle)
  const lat = CENTER_POINT[1] + LABEL_RADIUS * Math.sin(angle)
  return [lng, lat]
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

  useEffect(() => {
    if (typeof window === "undefined" || window.mapboxgl) {
      if (window.mapboxgl) setMapboxLoaded(true)
      return
    }

    const loadMapbox = () => {
      const cssLink = document.createElement("link")
      cssLink.rel = "stylesheet"
      cssLink.href = "https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css"
      document.head.appendChild(cssLink)

      const script = document.createElement("script")
      script.src = "https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js"
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

  useEffect(() => {
    const styleEl = document.createElement("style")
    styleEl.textContent = markerStyles
    document.head.appendChild(styleEl)
    return () => styleEl.remove()
  }, [])

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current || loading || error || !token || !mapboxLoaded || !window.mapboxgl) {
      if (error) console.error("Mapbox token error:", error)
      return
    }

    try {
      window.mapboxgl.accessToken = token

      mapRef.current = new window.mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/azizullah2611/cm7009fqu01j101pbe23262j4",
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

      mapRef.current.scrollZoom.enable()
      mapRef.current.dragPan.enable()
      mapRef.current.touchZoomRotate.enable()

      mapRef.current.on("load", () => {
        setMapLoaded(true)
        mapRef.current.getCanvas().style.filter = "contrast(1.15) saturate(1.2) brightness(0.95)"
      })

      mapRef.current.on("zoom", () => {
        try {
          debouncedUpdateMarkers()
        } catch (error) {
          console.error("Error handling zoom event:", error)
        }
      })

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

  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return

    Object.values(markersRef.current).forEach((marker) => marker?.remove?.())
    markersRef.current = {}

    const markers: { [key: string]: any } = {}

    locations.forEach((location, index) => {
      try {
        if (!isValidCoordinate(location.coordinates)) {
          console.error(`Invalid coordinates for ${location.place}:`, location.coordinates)
          return
        }

        const labelPosition = getRadialPosition(index, locations.length)

        markers[location.place] = createMarker({
          name: location.place,
          coordinates: location.coordinates,
          labelPosition: labelPosition,
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
    labelPosition,
    map,
  }: {
    name: string
    coordinates: [number, number]
    labelPosition: [number, number]
    map: any
  }) {
    try {
      if (!isValidCoordinate(coordinates)) {
        console.error(`Invalid coordinates for marker ${name}:`, coordinates)
        throw new Error(`Invalid coordinates for marker ${name}`)
      }

      const markerElement = document.createElement("div")
      markerElement.className = "marker-container"
      markerElement.style.position = "absolute"
      markerElement.style.pointerEvents = "auto"
      markerElement.style.willChange = "transform"

      markerElement.classList.add("w-12", "h-12", "sm:w-14", "sm:h-14", "md:w-16", "md:h-16")

      const shadow = document.createElement("div")
      shadow.className = "marker-shadow"

      const circleElement = document.createElement("div")
      circleElement.className = "marker-circle"

      const label = document.createElement("button")
      label.className = "marker-label"
      label.textContent = name
      label.setAttribute("aria-label", name)

      const labelDx = labelPosition[0] - coordinates[0]
      const labelDy = labelPosition[1] - coordinates[1]
      const labelDistance = Math.sqrt(labelDx * labelDx + labelDy * labelDy)
      const labelAngle = Math.atan2(labelDy, labelDx)

      // Convert to pixel offset
      const pixelDistance = labelDistance * 100000 // Rough conversion
      let offsetX = Math.cos(labelAngle) * Math.min(pixelDistance, 120)
      const offsetY = Math.sin(labelAngle) * Math.min(pixelDistance, 120)

      if (name === "إدارة الدوريات الخاصة") {
        offsetX -= 15
      }

      if (name === "الضبط المروري والمراسم") {
        offsetX -= 30
      }

      if (name === "ساحة حجز المركبات فلج هزاع") {
        offsetX += 60
      }

      const manual = manualLabelOffsets[name]
      if (manual) {
        if (typeof manual.left === "number") label.style.left = `${manual.left}px`
        else label.style.left = `calc(50% + ${offsetX}px)`
        if (typeof manual.top === "number") label.style.top = `${manual.top}px`
        else label.style.top = `calc(50% + ${offsetY}px)`
      } else {
        label.style.left = `calc(50% + ${offsetX}px)`
        label.style.top = `calc(50% + ${offsetY}px)`
      }
      label.style.transform = "translate(-50%, -50%)"

      label.addEventListener("mouseenter", (e) => {
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

      label.addEventListener("mouseleave", (e) => {
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

      label.addEventListener("click", (e) => {
        e.stopPropagation()
        setHoveredLocation(name)
        setClickedMarker(name)

        const location = locations.find((loc) => loc.place === name)
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

      markerElement.appendChild(shadow)
      markerElement.appendChild(circleElement)
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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.08),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(59,130,246,0.05)_60deg,transparent_120deg)] pointer-events-none" />

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
        <div className="flex-1 relative">
          <div ref={mapContainerRef} className="relative w-full h-full overflow-hidden" />

          <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-800/30 via-slate-800/10 to-transparent pointer-events-none" />
        </div>

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
