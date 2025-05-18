"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import Image from "next/image"
import { abuDhabiCityBoundary } from "@/data/abuDhabiCityCoordinates"
import { alainBoundaryData } from "@/data/alainCoordinates"
import { westRegionBoundary, WEST_REGION_IDENTIFIER } from "@/data/westRegionCoordinates"
import { dubaiCityBoundary, DUBAI_CITY_IDENTIFIER } from "@/data/dubaiCityCoordinates"
import MapMarker from "@/components/MapMarker"
import * as ReactDOM from "react-dom/client"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { otherCitiesBoundary, OTHER_CITIES_IDENTIFIER } from "@/data/otherCitiesCoordinates"
import { useMapboxToken } from "@/hooks/useMapboxToken"
import { useMobile } from "@/hooks/use-mobile"

// Lazy load the WeatherWidget
const WeatherWidget = dynamic(() => import("@/components/WeatherWidget").then((mod) => mod.WeatherWidget), {
  ssr: false,
  loading: () => <div className="w-[203px] h-[200px] bg-gray-800/50 backdrop-blur-sm rounded-lg animate-pulse" />,
})

const uaeMarkers = [
  {
    name: "Western Region",
    coordinates: [53.87278175962723, 24.042024462497247] as [number, number],
    size: "medium" as const,
    colorIndex: 0,
  },
  {
    name: "Abu Dhabi",
    coordinates: [54.66979766635052, 24.68024705061484] as [number, number],
    size: "large" as const,
    colorIndex: 1,
    description:
      "Abu Dhabi, the capital of the UAE, is a modern marvel blending traditional heritage with futuristic vision. Home to iconic landmarks like the Sheikh Zayed Grand Mosque and Louvre Abu Dhabi, the city offers a perfect balance of culture, luxury, and innovation.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/download.jpg-kq5OY30TX7ktQ8DWG63QWBDR8T9B3Q.jpeg",
    zoomLevel: 12,
  },
  {
    name: "Al Ain",
    coordinates: [55.639593245161706, 24.542777037539345] as [number, number],
    size: "medium" as const,
    colorIndex: 2,
  },
  {
    name: "Dubai",
    coordinates: [55.29697034790328, 25.455502707312035] as [number, number],
    size: "large" as const,
    colorIndex: 3,
  },
  {
    name: "Other Cities",
    coordinates: [56.15525759716897, 25.317058173109572] as [number, number],
    size: "medium" as const,
    colorIndex: 1,
  },
]

export default function Home() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [styleLoaded, setStyleLoaded] = useState(false)
  const router = useRouter()
  const markersRef = useRef(new Map())
  const { token, loading, error } = useMapboxToken()
  const isMobile = useMobile()
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  })

  const handleMarkerClick = useCallback(
    (marker: (typeof uaeMarkers)[0]) => {
      console.log(`Marker clicked: ${marker.name}`)
      if (marker.name === "Abu Dhabi") {
        router.push("/abu-dhabi")
      } else if (marker.name === "Al Ain") {
        router.push("/al-ain")
      } else if (map.current) {
        // Instead of flying to the marker, just zoom in at the current center
        map.current.easeTo({
          zoom: 9,
          duration: 2000,
        })
      }
    },
    [router],
  )

  const addRegion = useCallback(
    (id: string, data: any, color: string) => {
      if (!map.current || !styleLoaded) return

      try {
        // Check if the source already exists to avoid errors
        if (!map.current.getSource(id)) {
          map.current.addSource(id, {
            type: "geojson",
            data: data,
          })
        }

        // Check if the layer already exists to avoid errors
        if (!map.current.getLayer(`${id}-fill`)) {
          map.current.addLayer({
            id: `${id}-fill`,
            type: "fill",
            source: id,
            paint: {
              "fill-color": "#333333",
              "fill-opacity": 0.4,
            },
          })
        }

        if (!map.current.getLayer(`${id}-outline`)) {
          map.current.addLayer({
            id: `${id}-outline`,
            type: "line",
            source: id,
            paint: {
              "line-color": "#ffffff",
              "line-width": 4,
            },
          })
        }
      } catch (error) {
        console.error(`Error adding region ${id}:`, error)
      }
    },
    [styleLoaded],
  )

  const addClickZoom = useCallback(
    (layerId: string) => {
      if (!map.current || !styleLoaded) return

      map.current.on("click", layerId, (e) => {
        if (e.features && e.features[0].geometry.type === "Polygon") {
          try {
            // Instead of fitting to bounds, just zoom in at the current center
            if (map.current) {
              map.current.easeTo({
                zoom: Math.min(map.current.getZoom() + 1, 10),
                duration: 1000,
              })
            }
          } catch (error) {
            console.error(`Error handling click zoom for ${layerId}:`, error)
          }
        }
      })
    },
    [styleLoaded],
  )

  const addHoverEffect = useCallback(
    (layerId: string, defaultColor: string, hoverColor: string, defaultOpacity: number, hoverOpacity: number) => {
      if (!map.current || !styleLoaded) return

      const handleMouseEnter = () => {
        if (map.current) {
          map.current.getCanvas().style.cursor = "pointer"
          map.current.setPaintProperty(layerId, "fill-color", "#555555")
          map.current.setPaintProperty(layerId, "fill-opacity", 0.6)
        }
      }

      const handleMouseLeave = () => {
        if (map.current) {
          map.current.getCanvas().style.cursor = ""
          map.current.setPaintProperty(layerId, "fill-color", "#333333")
          map.current.setPaintProperty(layerId, "fill-opacity", 0.4)
        }
      }

      map.current.on("mouseenter", layerId, handleMouseEnter)
      map.current.on("mouseleave", layerId, handleMouseLeave)

      return () => {
        if (map.current) {
          map.current.off("mouseenter", layerId, handleMouseEnter)
          map.current.off("mouseleave", layerId, handleMouseLeave)
        }
      }
    },
    [styleLoaded],
  )

  const getInitialZoom = useCallback(() => {
    if (typeof window === "undefined") return 6.5
    const width = window.innerWidth
    if (width < 480) return 5.3
    if (width < 640) return 5.7
    if (width < 768) return 6.0
    if (width < 1024) return 6.5
    return 7.0
  }, [])

  // Function to add all regions and their interactions
  const setupRegions = useCallback(() => {
    if (!map.current || !styleLoaded) return

    try {
      addRegion("abu-dhabi-city", abuDhabiCityBoundary, "#333333")
      addRegion("alain-boundary", alainBoundaryData, "#333333")
      addRegion(WEST_REGION_IDENTIFIER, westRegionBoundary, "#333333")
      addRegion(DUBAI_CITY_IDENTIFIER, dubaiCityBoundary, "#333333")
      addRegion(OTHER_CITIES_IDENTIFIER, otherCitiesBoundary, "#333333")

      if (map.current.getLayer("uae-boundary-fill")) {
        map.current.setLayoutProperty("uae-boundary-fill", "visibility", "none")
        map.current.setLayoutProperty("uae-boundary-outline", "visibility", "none")
      }

      const regions = ["abu-dhabi-city", "alain-boundary", WEST_REGION_IDENTIFIER, DUBAI_CITY_IDENTIFIER]
      regions.forEach((region) => addClickZoom(`${region}-fill`))

      addHoverEffect("abu-dhabi-city-fill", "#333333", "#555555", 0.4, 0.6)
      addHoverEffect("alain-boundary-fill", "#333333", "#555555", 0.4, 0.6)
      addHoverEffect(`${WEST_REGION_IDENTIFIER}-fill`, "#333333", "#555555", 0.4, 0.6)
      addHoverEffect(`${DUBAI_CITY_IDENTIFIER}-fill`, "#333333", "#555555", 0.4, 0.6)
      addHoverEffect(`${OTHER_CITIES_IDENTIFIER}-fill`, "#333333", "#555555", 0.4, 0.6)
    } catch (error) {
      console.error("Error setting up regions:", error)
    }
  }, [addRegion, addClickZoom, addHoverEffect, styleLoaded])

  const initializeMap = useCallback(() => {
    try {
      if (map.current || !mapContainer.current) return
      if (loading) return
      if (error || !token) {
        throw new Error("Mapbox access token error: " + (error || "Token not available"))
      }

      mapboxgl.accessToken = token

      const initialZoom = getInitialZoom()

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/azizullah2611/cm7009fqu01j101pbe23262j4",
        center: [54.5, 24.2],
        zoom: initialZoom,
        minZoom: Math.max(initialZoom - 1.5, 4.0),
        maxZoom: 15,
        pitch: isMobile ? 35 : 45,
        bearing: 0,
        attributionControl: false,
        trackResize: true,
        dragPan: false, // Disable panning
        scrollZoom: false,
        boxZoom: false,
        doubleClickZoom: false,
        touchZoomRotate: false,
        keyboard: false,
        interactive: false, // Disable all interactive features
        fadeDuration: 0,
      })

      const scale = new mapboxgl.ScaleControl({
        maxWidth: isMobile ? 80 : 150,
        unit: "metric",
      })
      map.current.addControl(scale, "bottom-left")

      // Disable map rotation with touch rotation gesture
      map.current.touchZoomRotate.disableRotation()

      // Disable map drag pan
      map.current.dragPan.disable()

      // Disable keyboard interactions
      map.current.keyboard.disable()

      // Listen for the style.load event specifically
      map.current.on("style.load", () => {
        console.log("Map style loaded")
        setStyleLoaded(true)
      })

      map.current.on("load", () => {
        console.log("Map loaded")
        setMapLoaded(true)
      })

      // Add error handling
      map.current.on("error", (e) => {
        console.error("Mapbox error:", e.error)
      })
    } catch (error) {
      console.error("Error initializing map:", error)
      setMapLoaded(false)
      setStyleLoaded(false)
    }
  }, [error, getInitialZoom, isMobile, loading, token])

  // Effect to initialize the map
  useEffect(() => {
    initializeMap()

    return () => {
      if (map.current && !map.current._removed) {
        map.current.remove()
        map.current = null
      }
    }
  }, [initializeMap])

  // Effect to handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })

      if (map.current && !map.current._removed) {
        map.current.resize()

        const newZoom = getInitialZoom()
        if (Math.abs(map.current.getZoom() - newZoom) > 0.5) {
          map.current.setZoom(newZoom)
        }

        const newPitch = window.innerWidth < 640 ? 35 : 45
        if (Math.abs(map.current.getPitch() - newPitch) > 5) {
          map.current.setPitch(newPitch)
        }
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [getInitialZoom])

  // Effect to setup regions once style is loaded
  useEffect(() => {
    if (styleLoaded && map.current) {
      console.log("Setting up regions")
      setupRegions()
    }
  }, [styleLoaded, setupRegions])

  // Effect to add markers once map is loaded
  useEffect(() => {
    if (mapLoaded && styleLoaded && map.current && !map.current._removed) {
      console.log("Adding markers")

      // Clear existing markers
      markersRef.current.forEach((marker) => {
        marker.remove()
      })
      markersRef.current.clear()

      const markerScale =
        windowSize.width < 640 ? 0.75 : windowSize.width < 768 ? 0.85 : windowSize.width < 1024 ? 0.9 : 1

      uaeMarkers.forEach((marker) => {
        const el = document.createElement("div")
        el.className = "custom-marker"

        el.style.cursor = "pointer"
        el.addEventListener("click", (e) => {
          e.stopPropagation()
          console.log(`Marker element clicked: ${marker.name}`)
          handleMarkerClick(marker)
        })

        el.style.transform = `scale(${markerScale})`
        el.style.transformOrigin = "center bottom"

        const markerComponent = (
          <MapMarker
            key={marker.name}
            x={0}
            y={0}
            name={marker.name}
            size={marker.size}
            colorIndex={marker.colorIndex}
            coordinates={marker.coordinates}
            onClick={() => {
              console.log(`MapMarker component clicked: ${marker.name}`)
              handleMarkerClick(marker)
            }}
          />
        )

        const markerRoot = ReactDOM.createRoot(el)
        markerRoot.render(markerComponent)

        const mapboxMarker = new mapboxgl.Marker({
          element: el,
          anchor: "center",
        })
          .setLngLat(marker.coordinates)
          .addTo(map.current!)

        mapboxMarker.getElement().addEventListener("click", () => {
          console.log(`Mapbox marker clicked: ${marker.name}`)
          handleMarkerClick(marker)
        })

        markersRef.current.set(marker.name, mapboxMarker)
      })
    }
  }, [mapLoaded, styleLoaded, handleMarkerClick, windowSize])

  // Effect to add dark overlay
  useEffect(() => {
    if (mapLoaded && styleLoaded && map.current && !map.current._removed) {
      try {
        if (map.current.getLayer("dark-overlay")) {
          map.current.removeLayer("dark-overlay")
        }

        if (!map.current.getSource("overlay-source")) {
          map.current.addSource("overlay-source", {
            type: "geojson",
            data: {
              type: "Feature",
              geometry: {
                type: "Polygon",
                coordinates: [
                  [
                    [-180, -90],
                    [180, -90],
                    [180, 90],
                    [-180, 90],
                    [-180, -90],
                  ],
                ],
              },
            },
          })
        }

        const layers = map.current.getStyle().layers || []

        let firstSymbolId
        for (const layer of layers) {
          if (layer.type === "symbol") {
            firstSymbolId = layer.id
            break
          }
        }

        map.current.addLayer(
          {
            id: "dark-overlay",
            type: "fill",
            source: "overlay-source",
            layout: {},
            paint: {
              "fill-color": "#000000",
              "fill-opacity": isMobile ? 0.3 : 0.4,
            },
          },
          firstSymbolId,
        )
      } catch (error) {
        console.error("Error adding dark overlay:", error)
      }
    }
  }, [mapLoaded, styleLoaded, isMobile])

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="fixed inset-0 z-40 pointer-events-none overflow-hidden">
        {/* Reduced number of clouds and made them smaller/less opaque */}
        <div className="absolute w-full">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/clouds-6rqsL8YqlRI1TMaunqYleo5dJEVV1B.png"
            alt="Cloud 1"
            width={300}
            height={150}
            className="absolute left-0 animate-cloud-fast opacity-50 w-[150px] sm:w-[200px] md:w-[300px]"
            priority
          />
        </div>

        <div className="absolute w-full top-1/3">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/clouds-6rqsL8YqlRI1TMaunqYleo5dJEVV1B.png"
            alt="Cloud 3"
            width={400}
            height={200}
            className="absolute left-1/3 animate-cloud-medium opacity-60 scale-x-[-1] w-[200px] sm:w-[250px] md:w-[350px]"
          />
        </div>

        {/* Only show one cloud in the bottom section */}
        {!isMobile && (
          <div className="absolute w-full top-2/3">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/clouds-6rqsL8YqlRI1TMaunqYleo5dJEVV1B.png"
              alt="Cloud 5"
              width={450}
              height={225}
              className="absolute left-2/3 animate-cloud-slow opacity-55 w-[225px] sm:w-[300px] md:w-[400px]"
            />
          </div>
        )}
      </div>

      <div className={`fixed ${isMobile ? "top-1/5" : "top-1/4"} z-50 pointer-events-none`}>
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/isolated-plane-details-zZkhEVsNZiw649CY3B0tyR5DoCwxLz.png"
          alt="Flying airplane"
          width={150}
          height={50}
          className="animate-fly w-[80px] xs:w-[100px] sm:w-[125px] md:w-[150px]"
          priority
          sizes="(max-width: 480px) 80px, (max-width: 640px) 100px, (max-width: 768px) 125px, 150px"
        />
      </div>

      <div className="relative w-full h-full">
        <div ref={mapContainer} className="w-full h-full" />
      </div>

      <div className="fixed top-20 left-4 z-40 weather-widget hidden sm:block">
        <WeatherWidget />
      </div>

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-black/80 p-4 rounded-lg flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-t-white border-r-white/50 border-b-white/30 border-l-white/10 rounded-full animate-spin mb-2"></div>
            <p className="text-white text-sm">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  )
}
