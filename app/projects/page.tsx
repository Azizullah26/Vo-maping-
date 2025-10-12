"use client"

import { useEffect, useRef, useState } from "react"
import { Building2, ChevronDown, CuboidIcon as Cube, Radio, FileText, X } from "lucide-react"
import MapOverlay from "@/components/MapOverlay"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import mapboxgl from "mapbox-gl"
import { ErrorBoundary } from "react-error-boundary"
import * as ReactDOM from "react-dom/client"
import MapMarker from "@/components/MapMarker"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Image from "next/image"
import { cn } from "@/lib/utils"
import styles from "@/styles/saadiyat-view.module.css"
import dynamic from "next/dynamic"
import { CenterView3D } from "@/app/components/CenterView3D"

const Model = dynamic(() => import("@/components/Model"), { ssr: false })

const islandProjectsBoundary = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [54.47686843774173, 24.584853303843957],
            [54.47686843774173, 24.58775086840484],
            [54.47328366649248, 24.58775086840484],
            [54.47109297295199, 24.584128902227746],
            [54.46750820170274, 24.57833353846054],
            [54.45675388795647, 24.56800988262559],
            [54.441817341086704, 24.55315681587598],
            [54.42230025317562, 24.5413817934284],
            [54.41493155672097, 24.541562955990457],
            [54.40417724297319, 24.54011364817096],
            [54.40079162568304, 24.539932483516566],
            [54.39780431630936, 24.544280363034318],
            [54.39322377526938, 24.538483156867102],
            [54.39740600839275, 24.533591555857868],
            [54.40178739547517, 24.526887941177975],
            [54.41134678547175, 24.519640387569183],
            [54.42409263880097, 24.511848801018857],
            [54.436041876297026, 24.512754824282],
            [54.4527708087906, 24.506593737271913],
            [54.45735134983207, 24.501338453795654],
            [54.47149128086858, 24.49282080368984],
            [54.475872667950995, 24.503513080502515],
            [54.470296357118826, 24.516741249024975],
            [54.46631327795305, 24.52072754727304],
            [54.45974119733009, 24.539751318600665],
            [54.45675388795647, 24.54935269871342],
            [54.46213104482962, 24.560402434117066],
            [54.46870312545249, 24.572900141417506],
            [54.47705757230182, 24.58333647651982],
            [54.4777447702736, 24.585084890539235],
            [54.47708681444004, 24.58649423147675],
            [54.47686843774173, 24.584853303843957],
          ],
        ],
      },
    },
  ],
}

const projects = [
  {
    name: "Saadiyat Island",
    coordinates: [54.46535587428659, 24.57411176292652],
    size: "large" as const,
    colorIndex: 0,
    description:
      "Saadiyat Island is a natural island and a tourism-cultural environmentally friendly project for Emirati heritage and culture that is located in Abu Dhabi, United Arab Emirates.",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/saa1-NkZAQnNzz2YzyUhZhNsdjFPb8BzQND.png",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/saa2-erCkjj1UQbZs2RUmFUlu8kr3GKg2g0.png",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/saad3-ZwTbRl501bMabKi9Sgc70ipIt6cEjv.png",
    ],
    glbFile:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/large_low_poly_building-ncHZO7s2JMHKlbec7mqi1FlKfCTm9k.glb",
  },
  {
    name: "Louvre Abu Dhabi",
    coordinates: [54.40713326978539, 24.535227067502547],
    size: "medium" as const,
    colorIndex: 1,
    description:
      "The Louvre Abu Dhabi is an art and civilization museum, established in 2017. It is located on the Saadiyat Island Cultural District.",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/louvre1-2Aw9Hy5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/louvre2-2Aw9Hy5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/louvre3-2Aw9Hy5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.jpg",
    ],
    glbFile:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/large_low_poly_building-ncHZO7s2JMHKlbec7mqi1FlKfCTm9k.glb",
  },
  {
    name: "Zayed National Museum",
    coordinates: [54.43502311879533, 24.54522714063134],
    size: "medium" as const,
    colorIndex: 2,
    description:
      "The Zayed National Museum is a planned museum showcasing the history, culture, and socio-economic transformation of the United Arab Emirates.",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/zayed1-2Aw9Hy5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/zayed2-2Aw9Hy5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/zayed3-2Aw9Hy5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.jpg",
    ],
    glbFile:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/large_low_poly_building-ncHZO7s2JMHKlbec7mqi1FlKfCTm9k.glb",
  },
  {
    name: "Guggenheim Abu Dhabi",
    coordinates: [54.451716313091566, 24.523744519506792],
    size: "medium" as const,
    colorIndex: 0,
    description:
      "The Guggenheim Abu Dhabi is a planned museum of modern and contemporary art, to be located in Abu Dhabi, UAE.",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/guggenheim1-2Aw9Hy5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/guggenheim2-2Aw9Hy5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/guggenheim3-2Aw9Hy5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.jpg",
    ],
    glbFile:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/large_low_poly_building-ncHZO7s2JMHKlbec7mqi1FlKfCTm9k.glb",
  },
  {
    name: "NYU Abu Dhabi",
    coordinates: [54.434208816634396, 24.51596542268338],
    size: "small" as const,
    colorIndex: 1,
    description:
      "New York University Abu Dhabi (NYUAD) is a private liberal arts college in Abu Dhabi, United Arab Emirates.",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/nyu1-2Aw9Hy5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/nyu2-2Aw9Hy5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/nyu3-2Aw9Hy5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.jpg",
    ],
    glbFile:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/large_low_poly_building-ncHZO7s2JMHKlbec7mqi1FlKfCTm9k.glb",
  },
  {
    name: "Cranleigh Abu Dhabi",
    coordinates: [54.448866255529765, 24.535967840987155],
    size: "small" as const,
    colorIndex: 2,
    description: "Cranleigh Abu Dhabi is a British international school in Abu Dhabi, United Arab Emirates.",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cranleigh1-2Aw9Hy5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cranleigh2-2Aw9Hy5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cranleigh3-2Aw9Hy5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.jpg",
    ],
    glbFile:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/large_low_poly_building-ncHZO7s2JMHKlbec7mqi1FlKfCTm9k.glb",
  },
  {
    name: "Mamsha Al Saadiyat",
    coordinates: [54.452123464172104, 24.557078047074143],
    size: "small" as const,
    colorIndex: 0,
    description:
      "Mamsha Al Saadiyat is a beachfront promenade located on Saadiyat Island in Abu Dhabi, United Arab Emirates.",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mamsha1-2Aw9Hy5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mamsha2-2Aw9Hy5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mamsha3-2Aw9Hy5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.jpg",
    ],
    glbFile:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/large_low_poly_building-ncHZO7s2JMHKlbec7mqi1FlKfCTm9k.glb",
  },
  {
    name: "Jawaher Saadiyat",
    coordinates: [54.41995852881942, 24.525967030105164],
    size: "small" as const,
    colorIndex: 1,
    description:
      "Jawaher Saadiyat is a residential development located on Saadiyat Island in Abu Dhabi, United Arab Emirates.",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/jawaher1-2Aw9Hy5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/jawaher2-2Aw9Hy5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/jawaher3-2Aw9Hy5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.jpg",
    ],
    glbFile:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/large_low_poly_building-ncHZO7s2JMHKlbec7mqi1FlKfCTm9k.glb",
  },
  {
    name: "Saadiyat Grove",
    coordinates: [54.42830512596828, 24.533745507417976],
    size: "medium" as const,
    colorIndex: 2,
    description:
      "Saadiyat Grove is a residential development located on Saadiyat Island in Abu Dhabi, United Arab Emirates.",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/grove1-2Aw9Hy5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/grove2-2Aw9Hy5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/grove3-2Aw9Hy5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.jpg",
    ],
    glbFile:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/large_low_poly_building-ncHZO7s2JMHKlbec7mqi1FlKfCTm9k.glb",
  },
]

export default function ProjectsPage() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [activeProject, setActiveProject] = useState<string>()
  const [showProjectView, setShowProjectView] = useState(false)
  const [show3DView, setShow3DView] = useState(false)

  useEffect(() => {
    if (map.current) return

    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
    if (!accessToken) {
      console.error("Mapbox access token is missing")
      return
    }

    mapboxgl.accessToken = accessToken
    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/azizullah2611/cm7009fqu01j101pbe23262j4",
      center: [54.46535587428659, 24.57411176292652],
      zoom: 9,
    }).on("error", (e) => {
      console.error("Map error:", e)
    })

    console.log("Projects map initialized with custom style")

    map.current.on("load", () => {
      setMapLoaded(true)

      if (!map.current) return

      map.current.addSource("island-projects-boundary", {
        type: "geojson",
        data: islandProjectsBoundary,
      })

      map.current.addLayer({
        id: "island-projects-boundary-fill",
        type: "fill",
        source: "island-projects-boundary",
        layout: {},
        paint: {
          "fill-color": "#0080ff",
          "fill-opacity": 0.3,
        },
      })

      map.current.addLayer({
        id: "island-projects-boundary-line",
        type: "line",
        source: "island-projects-boundary",
        layout: {},
        paint: {
          "line-color": "#0080ff",
          "line-width": 2,
        },
      })

      // Add hover effect
      map.current.on("mouseenter", "island-projects-boundary-fill", () => {
        if (map.current) {
          map.current.setPaintProperty("island-projects-boundary-fill", "fill-color", "#00a0ff")
          map.current.setPaintProperty("island-projects-boundary-fill", "fill-opacity", 0.5)
          map.current.setPaintProperty("island-projects-boundary-line", "line-color", "#00a0ff")
          map.current.setPaintProperty("island-projects-boundary-line", "line-width", 3)
          map.current.getCanvas().style.cursor = "pointer"
        }
      })

      map.current.on("mouseleave", "island-projects-boundary-fill", () => {
        if (map.current) {
          map.current.setPaintProperty("island-projects-boundary-fill", "fill-color", "#0080ff")
          map.current.setPaintProperty("island-projects-boundary-fill", "fill-opacity", 0.3)
          map.current.setPaintProperty("island-projects-boundary-line", "line-color", "#0080ff")
          map.current.setPaintProperty("island-projects-boundary-line", "line-width", 2)
          map.current.getCanvas().style.cursor = ""
        }
      })

      // Fit the map to the islandProjectsBoundary
      const bounds = new mapboxgl.LngLatBounds()
      islandProjectsBoundary.features[0].geometry.coordinates[0].forEach((coord) => {
        bounds.extend(coord as [number, number])
      })
      map.current.fitBounds(bounds, { padding: 50, duration: 1000 })

      // Add zoom controls to the bottom right
      map.current.addControl(new mapboxgl.NavigationControl(), "bottom-right")

      // Add zoom end event listener to prevent zooming out beyond the initial zoom level
      map.current.on("zoom", () => {
        if (map.current && map.current.getZoom() < 9) {
          map.current.setZoom(9)
        }
      })
    })

    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [])

  useEffect(() => {
    if (mapLoaded && map.current) {
      // Clear existing markers
      map.current.getStyle().layers.forEach((layer) => {
        if (layer.id.startsWith("marker-")) {
          map.current!.removeLayer(layer.id)
          map.current!.removeSource(layer.id)
        }
      })

      // Add markers for projects
      projects.forEach((project, index) => {
        const el = document.createElement("div")
        el.className = "custom-marker"

        const markerComponent = (
          <MapMarker
            key={project.name}
            x={0}
            y={0}
            name={project.name}
            size={project.size}
            colorIndex={project.colorIndex}
            coordinates={project.coordinates}
          />
        )

        const markerRoot = ReactDOM.createRoot(el)
        markerRoot.render(markerComponent)

        new mapboxgl.Marker(el)
          .setLngLat(project.coordinates)
          .addTo(map.current!)
          .getElement()
          .addEventListener("click", () => handleProjectClick(project))
      })
    }
  }, [mapLoaded])

  const handleProjectClick = (project: (typeof projects)[0]) => {
    if (map.current) {
      setActiveProject(project.name)
      setShowProjectView(true)
      map.current.flyTo({
        center: project.coordinates,
        zoom: 14,
        essential: true,
        duration: 1000,
      })
    }
  }

  const ProjectView = ({ project }: { project: (typeof projects)[0] }) => {
    return (
      <div
        className={cn(
          "fixed left-0 bottom-0 z-40 w-full md:w-[400px] md:left-4 md:top-20 md:bottom-auto bg-white rounded-lg shadow-lg transition-transform duration-300",
          showProjectView ? "translate-y-0 md:translate-x-0" : "translate-y-full md:translate-y-0 md:-translate-x-full",
        )}
      >
        <Card>
          <CardContent className="p-4">
            <button
              onClick={() => setShowProjectView(false)}
              className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white transition-colors"
              aria-label="Close project view"
            >
              <X className="h-4 w-4" />
            </button>
            <Carousel className="w-full">
              <CarouselContent>
                {project.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${project.name} image ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 400px) 100vw, 400px"
                        priority={index === 0}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
            <div className="mt-4 space-y-2">
              <h2 className="text-2xl font-bold">{project.name}</h2>
              <p className="text-sm text-muted-foreground">{project.description}</p>
            </div>
            <ul className={styles.iconList}>
              <li className={styles.iconItem} onClick={() => setShow3DView(!show3DView)}>
                {[...Array(5)].map((_, index) => (
                  <span key={index} className={styles.iconSpan}>
                    <Cube className={styles.icon} />
                  </span>
                ))}
                <p className={styles.label}>{show3DView ? "2D" : "3D"}</p>
              </li>
              <li className={styles.iconItem}>
                {[...Array(5)].map((_, index) => (
                  <span key={index} className={styles.iconSpan}>
                    <Radio className={styles.icon} />
                  </span>
                ))}
                <p className={styles.label}>Live</p>
              </li>
              <li className={styles.iconItem}>
                {[...Array(5)].map((_, index) => (
                  <span key={index} className={styles.iconSpan}>
                    <FileText className={styles.icon} />
                  </span>
                ))}
                <p className={styles.label}>Document</p>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div ref={mapContainer} className="w-full h-screen">
        {mapLoaded && (
          <ErrorBoundary fallback={<div>Something went wrong</div>}>
            <MapOverlay map={map.current} projects={projects} activeProject={activeProject} />
          </ErrorBoundary>
        )}
      </div>

      {activeProject && <ProjectView project={projects.find((p) => p.name === activeProject)!} />}

      {show3DView && activeProject && (
        <CenterView3D project={projects.find((p) => p.name === activeProject)!} onClose={() => setShow3DView(false)} />
      )}

      <div className="absolute right-4 top-20 z-10 w-full max-w-[250px] sm:max-w-[300px]">
        <div className="w-64 bg-white p-4 rounded-lg shadow-md">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="w-full justify-between text-sm sm:text-base">
                <span className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Island Projects Abu Dhabi</span>
                  <span className="sm:hidden">Projects</span>
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full max-w-[250px] sm:max-w-[300px]">
              {projects.map((project) => (
                <DropdownMenuItem key={project.name} onSelect={() => handleProjectClick(project)}>
                  {project.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )

  interface Marker {
    coordinates: [number, number]
    name: string
  }

  const handleMarkerClick = (marker: Marker) => {
    console.log(`Marker ${marker.name} clicked`)
  }

  const addVideoMarker = (marker: Marker) => {
    if (!map.current) return

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
    transition: all 0.3s ease;
  `

    const video = document.createElement("video")
    video.src = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo%20map-eTyBG07WXbspqZDOaFfP1CVgJPdZP3.mp4"
    video.loop = true
    video.muted = true
    video.playsInline = true
    video.style.cssText = `
    width: 100%;
    height: 100%;
    object-fit: contain;
    background: rgba(0, 0, 0, 0.1);
  `

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
  `

    el.appendChild(video)
    el.appendChild(fallbackImage)

    // Add hover effects
    el.addEventListener("mouseenter", () => {
      el.style.transform = "scale(1.1)"
      el.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.15)"
    })

    el.addEventListener("mouseleave", () => {
      el.style.transform = "scale(1)"
      el.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)"
    })

    const mapboxMarker = new mapboxgl.Marker(el).setLngLat(marker.coordinates).addTo(map.current)

    mapboxMarker.getElement().addEventListener("click", () => handleMarkerClick(marker))

    video.addEventListener("loadedmetadata", () => {
      video.play().catch((e) => {
        console.error("Error playing video:", e)
        video.style.display = "none"
        fallbackImage.style.display = "block"
      })
    })

    video.addEventListener("error", (e) => {
      console.error("Video error:", e)
      video.style.display = "none"
      fallbackImage.style.display = "block"
    })

    // Attempt to play the video periodically
    const playInterval = setInterval(() => {
      if (video.paused) {
        video.play().catch((e) => {
          console.error("Error playing video:", e)
          video.style.display = "none"
          fallbackImage.style.display = "block"
        })
      }
    }, 5000)

    // Clean up interval on component unmount
    return () => clearInterval(playInterval)
  }
}
