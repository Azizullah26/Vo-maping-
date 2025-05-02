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
  const router = useRouter()
  const markersRef = useRef(new Map())

  const handleMarkerClick = useCallback(
    (marker: (typeof uaeMarkers)[0]) => {
      if (marker.name === "Abu Dhabi") {
        router.push("/abu-dhabi")
      } else if (marker.name === "Al Ain") {
        router.push("/al-ain")
      } else if (map.current) {
        map.current.flyTo({
          center: marker.coordinates,
          zoom: 9,
          duration: 2000,
        })
      }
    },
    [router],
  )

  const addRegion = useCallback((id: string, data: any, color: string) => {
    if (!map.current) return

    try {
      if (!map.current.getSource(id)) {
        map.current.addSource(id, {
          type: "geojson",
          data: data,
        })
      }

      if (!map.current.getLayer(`${id}-fill`)) {
        map.current.addLayer({
          id: `${id}-fill`,
          type: "fill",
          source: id,
          paint: {
            "fill-color": color,
            "fill-opacity": 0.5,
          },
        })
      }

      if (!map.current.getLayer(`${id}-outline`)) {
        map.current.addLayer({
          id: `${id}-outline`,
          type: "line",
          source: id,
          paint: {
            "line-color": color,
            "line-width": 2,
          },
        })
      }
    } catch (error) {
      console.error(`Error adding region ${id}:`, error)
    }
  }, [])

  const addClickZoom = useCallback((layerId: string) => {
    if (!map.current) return

    map.current.on("click", layerId, (e) => {
      if (e.features && e.features[0].geometry.type === "Polygon") {
        try {
          const coordinates = e.features[0].geometry.coordinates[0] as [number, number][]
          const bounds = coordinates.reduce((bounds, coord) => {
            return bounds.extend(coord as mapboxgl.LngLatLike)
          }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]))

          map.current?.fitBounds(bounds, {
            padding: 50,
            duration: 1000,
          })
        } catch (error) {
          console.error(`Error handling click zoom for ${layerId}:`, error)
        }
      }
    })
  }, [])

  const addHoverEffect = useCallback(
    (layerId: string, defaultColor: string, hoverColor: string, defaultOpacity: number, hoverOpacity: number) => {
      if (!map.current) return

      const handleMouseEnter = () => {
        if (map.current) {
          map.current.getCanvas().style.cursor = "pointer"
          map.current.setPaintProperty(layerId, "fill-color", hoverColor)
          map.current.setPaintProperty(layerId, "fill-opacity", hoverOpacity)
        }
      }

      const handleMouseLeave = () => {
        if (map.current) {
          map.current.getCanvas().style.cursor = ""
          map.current.setPaintProperty(layerId, "fill-color", defaultColor)
          map.current.setPaintProperty(layerId, "fill-opacity", defaultOpacity)
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
    [],
  )

  const initializeMap = useCallback(() => {
    try {
      if (map.current || !mapContainer.current) return

      const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
      if (!accessToken) {
        throw new Error("Mapbox access token is missing")
      }

      mapboxgl.accessToken = accessToken

      const getInitialZoom = () => {
        if (typeof window === "undefined") return 6.5
        if (window.innerWidth < 640) return 5.5 // Mobile
        if (window.innerWidth < 768) return 6 // Tablet
        return 6.5 // Desktop
      }

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/azizullah2611/cm7009fqu01j101pbe23262j4",
        center: [54.3773, 24.4539],
        zoom: getInitialZoom(),
        minZoom: getInitialZoom(),
        maxZoom: getInitialZoom(),
        attributionControl: false,
        trackResize: true,
        dragPan: false,
        scrollZoom: false,
        boxZoom: false,
        doubleClickZoom: false,
        touchZoomRotate: false,
        keyboard: false,
        interactive: false,
      })

      // Remove the navigation control since we're disabling interactions
      // Delete or comment out this section:
      // if (typeof window !== "undefined" && window.innerWidth >= 640) {
      //   map.current.addControl(new mapboxgl.NavigationControl(), "bottom-right")
      // }

      map.current.on("load", () => {
        setMapLoaded(true)
        if (!map.current) return

        addRegion("abu-dhabi-city", abuDhabiCityBoundary, "#D3D3D3")
        addRegion("alain-boundary", alainBoundaryData, "#00FF00")
        addRegion(WEST_REGION_IDENTIFIER, westRegionBoundary, "#91001b")
        addRegion(DUBAI_CITY_IDENTIFIER, dubaiCityBoundary, "#07a6a0")
        addRegion(OTHER_CITIES_IDENTIFIER, otherCitiesBoundary, "#F5DEB3")

        // Hide UAE boundary by default
        if (map.current.getLayer("uae-boundary-fill")) {
          map.current.setLayoutProperty("uae-boundary-fill", "visibility", "none")
          map.current.setLayoutProperty("uae-boundary-outline", "visibility", "none")
        }

        const regions = ["abu-dhabi-city", "alain-boundary", WEST_REGION_IDENTIFIER, DUBAI_CITY_IDENTIFIER]
        regions.forEach((region) => addClickZoom(`${region}-fill`))

        addHoverEffect("abu-dhabi-city-fill", "#D3D3D3", "#A9A9A9", 0.5, 0.7)
        addHoverEffect("alain-boundary-fill", "#00FF00", "#00CC00", 0.3, 0.5)
        addHoverEffect(`${WEST_REGION_IDENTIFIER}-fill`, "#91001b", "#c40024", 0.5, 0.7)
        addHoverEffect(`${DUBAI_CITY_IDENTIFIER}-fill`, "#07a6a0", "#05847f", 0.5, 0.7)
        addHoverEffect(`${OTHER_CITIES_IDENTIFIER}-fill`, "#F5DEB3", "#DEB887", 0.5, 0.7)
      })
    } catch (error) {
      console.error("Error initializing map:", error)
      setMapLoaded(false)
    }
  }, [addRegion, addClickZoom, addHoverEffect])

  useEffect(() => {
    initializeMap()

    const handleResize = () => {
      if (map.current && !map.current._removed) {
        map.current.resize()
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (map.current && !map.current._removed) {
        map.current.remove()
        map.current = null
      }
      // Clean up markers
      markersRef.current.forEach((marker) => {
        marker.remove()
      })
      markersRef.current.clear()
    }
  }, [initializeMap])

  useEffect(() => {
    if (mapLoaded && map.current && !map.current._removed) {
      // Clear existing markers
      markersRef.current.forEach((marker) => {
        marker.remove()
      })
      markersRef.current.clear()

      uaeMarkers.forEach((marker) => {
        const el = document.createElement("div")
        el.className = "custom-marker"
        el.addEventListener("click", () => handleMarkerClick(marker))

        const markerComponent = (
          <MapMarker
            key={marker.name}
            x={0}
            y={0}
            name={marker.name}
            size={marker.size}
            colorIndex={marker.colorIndex}
            coordinates={marker.coordinates}
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

        markersRef.current.set(marker.name, mapboxMarker)
      })
    }
  }, [mapLoaded, handleMarkerClick])

  useEffect(() => {
    if (mapLoaded && map.current && !map.current._removed) {
      // First, check if the overlay already exists and remove it if it does
      if (map.current.getLayer("dark-overlay")) {
        map.current.removeLayer("dark-overlay")
      }

      // Add a custom source for the overlay if it doesn't exist
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

      // Get all style layers to find the right insertion point
      const layers = map.current.getStyle().layers

      // Find the first symbol layer or label layer in the map style
      // Coordinates and labels are typically in symbol layers
      let firstSymbolId
      for (const layer of layers) {
        if (layer.type === "symbol") {
          firstSymbolId = layer.id
          break
        }
      }

      // Add the dark overlay as a fill layer
      // If a symbol layer was found, add before it to ensure it's below coordinates
      // Otherwise, add it as the top layer
      map.current.addLayer(
        {
          id: "dark-overlay",
          type: "fill",
          source: "overlay-source",
          layout: {},
          paint: {
            "fill-color": "#000000",
            "fill-opacity": 0.4,
          },
        },
        firstSymbolId,
      ) // This will place it below symbol layers (which include coordinates)
    }
  }, [mapLoaded])

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Clouds Container */}
      <div className="fixed inset-0 z-40 pointer-events-none overflow-hidden">
        {/* Fast moving clouds */}
        <div className="absolute w-full">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/clouds-6rqsL8YqlRI1TMaunqYleo5dJEVV1B.png"
            alt="Cloud 1"
            width={400}
            height={200}
            className="absolute left-0 animate-cloud-fast opacity-70"
          />
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/clouds-6rqsL8YqlRI1TMaunqYleo5dJEVV1B.png"
            alt="Cloud 2"
            width={300}
            height={150}
            className="absolute left-1/4 top-20 animate-cloud-fast opacity-75 scale-x-[-1]"
          />
        </div>

        {/* Medium speed clouds */}
        <div className="absolute w-full top-1/4">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/clouds-6rqsL8YqlRI1TMaunqYleo5dJEVV1B.png"
            alt="Cloud 3"
            width={500}
            height={250}
            className="absolute left-1/3 animate-cloud-medium opacity-80 scale-x-[-1]"
          />
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/clouds-6rqsL8YqlRI1TMaunqYleo5dJEVV1B.png"
            alt="Cloud 4"
            width={350}
            height={175}
            className="absolute left-2/3 top-40 animate-cloud-medium opacity-75"
          />
        </div>

        {/* Slow moving clouds */}
        <div className="absolute w-full top-1/2">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/clouds-6rqsL8YqlRI1TMaunqYleo5dJEVV1B.png"
            alt="Cloud 5"
            width={600}
            height={300}
            className="absolute left-1/2 animate-cloud-slow opacity-85"
          />
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/clouds-6rqsL8YqlRI1TMaunqYleo5dJEVV1B.png"
            alt="Cloud 6"
            width={450}
            height={225}
            className="absolute left-3/4 top-20 animate-cloud-slow opacity-80 scale-x-[-1]"
          />
        </div>
      </div>

      <div className="fixed top-1/4 z-50 pointer-events-none">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/isolated-plane-details-zZkhEVsNZiw649CY3B0tyR5DoCwxLz.png"
          alt="Flying airplane"
          width={150}
          height={50}
          className="animate-fly w-[100px] sm:w-[125px] md:w-[150px]"
          priority
          sizes="(max-width: 640px) 100px, (max-width: 768px) 125px, 150px"
        />
      </div>

      <div className="relative w-full h-full">
        <div ref={mapContainer} className="w-full h-full" />
      </div>

      <div className="fixed top-20 left-4 z-40 weather-widget hidden sm:block">
        <WeatherWidget />
      </div>
    </div>
  )
}
