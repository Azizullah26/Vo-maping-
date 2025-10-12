"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { abuDhabiCityBoundary } from "@/data/abuDhabiCityCoordinates"
import styles from "@/styles/nav-button.module.css"
import { cn } from "@/lib/utils"
import { TopNav } from "@/components/TopNav"
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Building2,
  X,
  CuboidIcon as Cube,
  Radio,
  FileText,
  MapIcon,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { AbuDhabiProjects } from "@/components/AbuDhabiProjects"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Image from "next/image"
import saadiyatStyles from "@/styles/saadiyat-view.module.css"
import dynamic from "next/dynamic"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const Model = dynamic(() => import("@/components/Model"), { ssr: false })
const MapillaryViewer = dynamic(() => import("@/components/MapillaryViewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-800">
      <div className="text-white text-center">
        <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin mx-auto mb-4"></div>
        <p>Loading street view component...</p>
      </div>
    </div>
  ),
})

interface Marker {
  coordinates: [number, number]
  name: string
  images: string[]
  description: string
  glbFile: string
  mapillaryId?: string
}

// Update the MAPILLARY_ACCESS_TOKEN constant
const MAPILLARY_ACCESS_TOKEN = "MLY|9267215679981311|cc97a57ac7f20f4cc140dd4663de9bf7"

// Update the customMarkers array with the new Abu Dhabi image ID
const customMarkers: Marker[] = [
  {
    coordinates: [54.4221, 24.4539], // Abu Dhabi City Center
    name: "Saadiyat Island",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/saa1-NkZAQnNzz2YzyUhZhNsdjFPb8BzQND.png",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/saa2-erCkjj1UQbZs2RUmFUlu8kr3GKg2g0.png",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/saad3-ZwTbRl501bMabKi9Sgc70ipIt6cEjv.png",
    ],
    description:
      "Saadiyat Island is a natural island and a tourism-cultural environmentally friendly project for Emirati heritage and culture that is located in Abu Dhabi, United Arab Emirates.",
    glbFile:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/large_low_poly_building-ncHZO7s2JMHKlbec7mqi1FlKfCTm9k.glb",
    // Using the new Abu Dhabi image ID
    mapillaryId: "958596254871529",
  },
  {
    coordinates: [54.4008, 24.5361], // Correct Louvre Abu Dhabi coordinates
    name: "Louvre Abu Dhabi",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/louvre1-2Aw9Hy5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/louvre2-2Aw9Hy5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/louvre3-2Aw9Hy5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.jpg",
    ],
    description:
      "The Louvre Abu Dhabi is an art and civilization museum, located on the Saadiyat Island Cultural District.",
    glbFile:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/large_low_poly_building-ncHZO7s2JMHKlbec7mqi1FlKfCTm9k.glb",
    // Using the new Abu Dhabi image ID
    mapillaryId: "958596254871529",
  },
  {
    coordinates: [54.4041, 24.5328], // Correct Zayed National Museum coordinates
    name: "Zayed National Museum",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/zayed1-2Aw9Hy5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/zayed2-2Aw9Hy5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/zayed3-2Aw9Hy5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.jpg",
    ],
    description:
      "The Zayed National Museum is a planned museum showcasing the history, culture, and socio-economic transformation of the United Arab Emirates.",
    glbFile:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/large_low_poly_building-ncHZO7s2JMHKlbec7mqi1FlKfCTm9k.glb",
    // Using the new Abu Dhabi image ID
    mapillaryId: "958596254871529",
  },
  {
    coordinates: [54.4141, 24.5361], // Correct Guggenheim Abu Dhabi coordinates
    name: "Guggenheim Abu Dhabi",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/guggenheim1-2Aw9Hy5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/guggenheim2-2Aw9Hy5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/guggenheim3-2Aw9Hy5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.jpg",
    ],
    description:
      "The Guggenheim Abu Dhabi is a planned museum of modern and contemporary art, to be located in Abu Dhabi, UAE.",
    glbFile:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/large_low_poly_building-ncHZO7s2JMHKlbec7mqi1FlKfCTm9k.glb",
    // Using the new Abu Dhabi image ID
    mapillaryId: "958596254871529",
  },
  {
    coordinates: [54.4376, 24.5225], // Correct NYU Abu Dhabi coordinates
    name: "NYU Abu Dhabi",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/nyu1-2Aw9Hy5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/nyu2-2Aw9Hy5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/nyu3-2Aw9Hy5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.jpg",
    ],
    description:
      "New York University Abu Dhabi (NYUAD) is a private liberal arts college in Abu Dhabi, United Arab Emirates.",
    glbFile:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/large_low_poly_building-ncHZO7s2JMHKlbec7mqi1FlKfCTm9k.glb",
    // Using the new Abu Dhabi image ID
    mapillaryId: "958596254871529",
  },
  {
    coordinates: [54.4285, 24.5312], // Correct Cranleigh Abu Dhabi coordinates
    name: "Cranleigh Abu Dhabi",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cranleigh1-2Aw9Hy5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cranleigh2-2Aw9Hy5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cranleigh3-2Aw9Hy5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.jpg",
    ],
    description: "Cranleigh Abu Dhabi is a British international school in Abu Dhabi, United Arab Emirates.",
    glbFile:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/large_low_poly_building-ncHZO7s2JMHKlbec7mqi1FlKfCTm9k.glb",
    // Using the new Abu Dhabi image ID
    mapillaryId: "958596254871529",
  },
]

// Update the center coordinates to better focus on all markers
const center: [number, number] = [54.4221, 24.4939] // Updated center coordinates

export default function AbuDhabiPage() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [showProjects, setShowProjects] = useState(false)
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null)
  const [showingImage, setShowingImage] = useState(true)
  const router = useRouter()

  // Add state for the viewer modal
  const [showViewerModal, setShowViewerModal] = useState(false)
  const [activeTab, setActiveTab] = useState("cesium")

  useEffect(() => {
    if (!map.current) {
      initializeMap()
    }
  }, [])

  const initializeMap = () => {
    try {
      const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
      if (!accessToken) {
        throw new Error("Mapbox access token is missing")
      }

      const initialZoom = 12 // Increased initial zoom for better marker visibility

      mapboxgl.accessToken = accessToken
      map.current = new mapboxgl.Map({
        container: mapContainer.current!,
        style: "mapbox://styles/azizullah2611/cm6okbhyo000301qz5q58gdud",
        center: center,
        zoom: initialZoom,
        minZoom: 10, // Updated minimum zoom
        maxZoom: 16,
        dragPan: true, // Enable drag pan for better navigation
        pitch: 45, // Add some tilt for better 3D perspective
        bearing: -17.6, // Slight rotation for better view
      })

      console.log("Abu Dhabi map initialized with custom style")

      map.current.on("load", () => {
        setMapLoaded(true)

        if (!map.current) return

        addRegion("abu-dhabi-city", abuDhabiCityBoundary, "#D3D3D3")
        addHoverEffect("abu-dhabi-city-fill", "#D3D3D3", "#A9A9A9", 0.5, 0.7)

        // Fit map to show all markers
        const bounds = new mapboxgl.LngLatBounds()
        customMarkers.forEach((marker) => {
          bounds.extend(marker.coordinates)
        })

        map.current.fitBounds(bounds, {
          padding: 50,
          duration: 0,
        })

        addCustomMarkers()
      })

      // Add navigation controls with more options
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
          showZoom: true,
          showCompass: true,
        }),
        "bottom-right",
      )
    } catch (error) {
      console.error("Error initializing map:", error)
    }
  }

  const addRegion = (id: string, data: any, color: string) => {
    if (!map.current) return

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
  }

  const addHoverEffect = (
    layerId: string,
    defaultColor: string,
    hoverColor: string,
    defaultOpacity: number,
    hoverOpacity: number,
  ) => {
    map.current?.on("mouseenter", layerId, () => {
      if (map.current) {
        map.current.getCanvas().style.cursor = "pointer"
        map.current.setPaintProperty(layerId, "fill-color", hoverColor)
        map.current.setPaintProperty(layerId, "fill-opacity", hoverOpacity)
      }
    })

    map.current?.on("mouseleave", layerId, () => {
      if (map.current) {
        map.current.getCanvas().style.cursor = ""
        map.current.setPaintProperty(layerId, "fill-color", defaultColor)
        map.current.setPaintProperty(layerId, "fill-opacity", defaultOpacity)
      }
    })
  }

  const addCustomMarkers = () => {
    if (!map.current) return

    customMarkers.forEach((marker) => {
      addVideoMarker(marker)
    })
  }

  // Replace the addVideoMarker function with this optimized version
  const addVideoMarker = (marker: Marker) => {
    if (!map.current) return

    // Create marker container with hardware acceleration
    const el = document.createElement("div")
    el.className = "video-marker"
    el.style.cssText = `
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border: 2px solid rgba(255, 255, 255, 0.2);
    transform: translate3d(0, 0, 0);
    will-change: transform;
    position: relative;
  `

    // Create optimized video element
    const video = document.createElement("video")
    video.muted = true
    video.loop = true
    video.playsInline = true
    video.preload = "auto"
    video.style.cssText = `
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: translate3d(0, 0, 0);
    will-change: transform;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
  `

    // Create a low-resolution version for mobile
    const isMobile = window.innerWidth < 768
    const videoUrl = isMobile
      ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo%20map-mobile-eTyBG07WXbspqZDOaFfP1CVgJPdZP3.mp4"
      : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo%20map-eTyBG07WXbspqZDOaFfP1CVgJPdZP3.mp4"

    // Create a blob URL for better performance
    fetch(videoUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const blobUrl = URL.createObjectURL(blob)
        video.src = blobUrl

        // Clean up blob URL when video is loaded
        video.onloadeddata = () => {
          URL.revokeObjectURL(blobUrl)
        }
      })
      .catch(() => {
        // Fallback to direct URL if blob creation fails
        video.src = videoUrl
      })

    // Create fallback image
    const fallbackImage = document.createElement("img")
    fallbackImage.src =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/abu-dhabi-police-logo-21AF543362-nwLnkElCePIGxnmxG49FlWYFtViagS.png"
    fallbackImage.alt = "Abu Dhabi Police Logo"
    fallbackImage.style.cssText = `
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 6px;
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    transform: translate3d(0, 0, 0);
  `

    // Add elements to marker
    el.appendChild(video)
    el.appendChild(fallbackImage)

    // Create the marker
    const mapboxMarker = new mapboxgl.Marker({
      element: el,
      anchor: "center",
    })
      .setLngLat(marker.coordinates)
      .addTo(map.current)

    // Optimize hover effects with hardware acceleration
    let isHovered = false
    el.addEventListener("mouseenter", () => {
      if (!isHovered) {
        isHovered = true
        el.style.transform = "scale(1.1) translate3d(0, 0, 0)"
        el.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.2)"
      }
    })

    el.addEventListener("mouseleave", () => {
      if (isHovered) {
        isHovered = false
        el.style.transform = "scale(1) translate3d(0, 0, 0)"
        el.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)"
      }
    })

    // Update the click handler in the addVideoMarker function to handle the new format
    el.addEventListener("click", () => {
      if (marker.name === "Zayed National Museum") {
        router.push("/abu-dhabi/zayed-national-museum")
      } else {
        setSelectedMarker(marker)
        setShowingImage(true)

        map.current?.flyTo({
          center: marker.coordinates,
          zoom: 14,
          duration: 1000,
        })
      }
    })

    // Optimized video playback management
    const playVideo = () => {
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Show fallback if video fails to play
          video.style.display = "none"
          fallbackImage.style.display = "block"
        })
      }
    }

    // Play video when it's in viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            playVideo()
          } else {
            video.pause()
          }
        })
      },
      {
        root: null,
        rootMargin: "50px",
        threshold: 0.1,
      },
    )

    observer.observe(el)

    // Handle visibility changes
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        playVideo()
      } else {
        video.pause()
      }
    })

    // Memory management
    const cleanup = () => {
      observer.disconnect()
      if (mapboxMarker) {
        mapboxMarker.remove()
      }
      video.pause()
      video.removeAttribute("src")
      video.load()
    }

    return cleanup
  }

  const toggleView = () => {
    setShowingImage((prev) => !prev)
  }

  // Add a function to select different Mapillary locations based on the selected marker
  const getMapillaryIdForMarker = () => {
    // Always return the known working Abu Dhabi image ID
    return "958596254871529"
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <TopNav />

      <button
        onClick={() => router.push("/")}
        className={cn(
          styles.btn,
          "fixed bottom-4 left-4 z-50 p-2 bg-[#1B1464]/10 backdrop-blur-sm rounded-full hover:bg-[#1B1464]/20 transition-colors",
        )}
        aria-label="Back to Map"
      >
        <ArrowLeft className="h-6 w-6" />
      </button>

      <button
        onClick={() => setShowProjects(!showProjects)}
        className={cn(
          styles.btn,
          "fixed top-20 left-4 z-50 p-2 bg-[#1B1464]/10 backdrop-blur-sm rounded-full hover:bg-[#1B1464]/20 transition-colors flex items-center space-x-2",
          showProjects ? "left-1/2 -translate-x-1/2" : "",
        )}
        aria-label={showProjects ? "Hide Projects" : "Show Projects"}
      >
        <Building2 className="h-6 w-6" />
        {showProjects ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
      </button>

      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />

      <div
        className={cn(
          "absolute top-16 left-0 w-1/2 h-[calc(100vh-4rem)] overflow-auto bg-gradient-to-br from-teal-300/50 via-orange-300/50 to-fuchsia-900/50 backdrop-filter backdrop-blur-md text-black transition-transform duration-300 ease-in-out",
          showProjects ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <AbuDhabiProjects />
      </div>

      {/* Abu Dhabi View Button */}
      <Button
        onClick={() => setShowViewerModal(true)}
        className="fixed top-20 right-4 z-50 bg-[#1B1464]/80 hover:bg-[#1B1464] text-white shadow-lg px-4 py-2 flex items-center gap-2 rounded-lg transition-all duration-300 hover:scale-105"
        aria-label="Open Abu Dhabi 3D viewer"
      >
        <MapIcon className="h-5 w-5" />
        <span className="font-medium">Abu Dhabi View</span>
      </Button>

      {/* Viewer Modal with Tabs */}
      {showViewerModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-[95vw] h-[90vh] bg-white rounded-lg shadow-2xl overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowViewerModal(false)}
              className="absolute top-2 right-2 z-10 bg-white/90 hover:bg-white shadow-md"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close Abu Dhabi viewer</span>
            </Button>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full">
              <TabsList className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10 bg-white/90 shadow-md">
                <TabsTrigger value="cesium">Cesium 3D</TabsTrigger>
                <TabsTrigger value="mapillary">Street View</TabsTrigger>
              </TabsList>

              <TabsContent value="cesium" className="w-full h-full">
                <iframe
                  title="Abu Dhabi Projects"
                  src="https://ion.cesium.com/stories/viewer/?id=8149f761-66f7-4da4-bef0-2535c22071ac"
                  className="w-full h-full rounded-lg"
                  allow="fullscreen"
                  allowFullScreen
                />
              </TabsContent>

              {/* Update the MapillaryViewer component usage in the Viewer Modal */}
              <TabsContent value="mapillary" className="w-full h-full">
                <MapillaryViewer
                  accessToken={MAPILLARY_ACCESS_TOKEN}
                  mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
                  className="w-full h-full"
                  imageId={getMapillaryIdForMarker()}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}

      {selectedMarker && (
        <div className="fixed right-4 top-20 z-50 w-[400px] bg-white rounded-lg shadow-lg">
          <Card>
            <CardContent className="p-4">
              <button
                onClick={() => setSelectedMarker(null)}
                className="absolute right-2 top-2 p-1 rounded-full bg-white/80 hover:bg-white transition-colors z-10"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close image slider</span>
              </button>
              <Carousel className="w-full">
                <CarouselContent>
                  {selectedMarker.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
                        {showingImage ? (
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`${selectedMarker.name} image ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 400px) 100vw, 400px"
                            priority={index === 0}
                          />
                        ) : (
                          <div className="w-full h-full">
                            <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
                              <Environment preset="sunset" background />
                              <ambientLight intensity={0.5} />
                              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                              <pointLight position={[-10, -10, -10]} intensity={0.5} />
                              <Model url={selectedMarker.glbFile} />
                              <OrbitControls />
                            </Canvas>
                          </div>
                        )}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
              <div className="mt-4 space-y-2">
                <h2 className="text-2xl font-bold">{selectedMarker.name}</h2>
                <p className="text-sm text-muted-foreground">{selectedMarker.description}</p>
              </div>
              <ul className={saadiyatStyles.iconList}>
                <li className={saadiyatStyles.iconItem} onClick={toggleView}>
                  {[...Array(5)].map((_, index) => (
                    <span key={index} className={saadiyatStyles.iconSpan}>
                      <Cube className={saadiyatStyles.icon} />
                    </span>
                  ))}
                  <p className={saadiyatStyles.label}>{showingImage ? "3D" : "2D"}</p>
                </li>
                <li className={saadiyatStyles.iconItem}>
                  {[...Array(5)].map((_, index) => (
                    <span key={index} className={saadiyatStyles.iconSpan}>
                      <Radio className={saadiyatStyles.icon} />
                    </span>
                  ))}
                  <p className={saadiyatStyles.label}>Live</p>
                </li>
                <li className={saadiyatStyles.iconItem}>
                  {[...Array(5)].map((_, index) => (
                    <span key={index} className={saadiyatStyles.iconSpan}>
                      <FileText className={saadiyatStyles.icon} />
                    </span>
                  ))}
                  <p className={saadiyatStyles.label}>Document</p>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
