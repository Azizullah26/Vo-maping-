"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { projects16, type Project16 } from "@/data/16-projects-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, MapPin, Clock, Building } from "lucide-react"

const statusColors = {
  completed: "bg-green-400 shadow-green-400/50",
  "in-progress": "bg-yellow-400 shadow-yellow-400/50",
  planned: "bg-blue-400 shadow-blue-400/50",
}

const statusLabels = {
  completed: "Completed",
  "in-progress": "In Progress",
  planned: "Planned",
}

const categoryIcons = {
  residential: "🏠",
  commercial: "🏢",
  infrastructure: "🏗️",
  public: "🏛️",
}

export default function SixteenProjectsPage() {
  const router = useRouter()
  const [selectedProject, setSelectedProject] = useState<Project16 | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 })
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleResize = () => {
      if (imageRef.current && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect()
        const imageRect = imageRef.current.getBoundingClientRect()
        setImageDimensions({
          width: imageRect.width,
          height: imageRect.height,
        })
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [imageLoaded])

  const handleImageLoad = () => {
    setImageLoaded(true)
    if (imageRef.current && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect()
      const imageRect = imageRef.current.getBoundingClientRect()
      setImageDimensions({
        width: imageRect.width,
        height: imageRect.height,
      })
    }
  }

  const getMarkerPosition = (percentageCoords: [number, number]) => {
    if (!imageLoaded || !imageRef.current || !containerRef.current) return { left: 0, top: 0 }

    const imageRect = imageRef.current.getBoundingClientRect()
    const containerRect = containerRef.current.getBoundingClientRect()

    // Calculate marker position using percentages
    const left = (percentageCoords[0] / 100) * imageRect.width + (imageRect.left - containerRect.left)
    const top = (percentageCoords[1] / 100) * imageRect.height + (imageRect.top - containerRect.top)

    return { left, top }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      {/* Floating Back Button */}
      <div className="absolute top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="text-white hover:bg-black/50 bg-black/30 backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="flex h-screen">
        {/* Main Map Area - Full Screen */}
        <div className="fixed inset-0 bg-gray-900 overflow-hidden text-white000" ref={containerRef}>
          <img
            ref={imageRef}
            src="/images/al-ain-16-projects-satellite.png"
            alt="Al Ain 16 Projects Satellite View"
            className="w-full h-full object-cover"
            onLoad={handleImageLoad}
          />

          {/* Project Markers */}
          {imageLoaded &&
            projects16.map((project) => {
              const position = getMarkerPosition(project.percentageCoordinates) // Changed from pixelCoordinates
              return (
                <div
                  key={project.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                  style={{
                    left: `${position.left}px`,
                    top: `${position.top}px`,
                  }}
                  onClick={() => setSelectedProject(project)}
                >
                  {/* Responsive Marker Circle */}
                  <div
                    className={`
                    w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full border-2 border-white shadow-2xl
                    bg-white group-hover:bg-black
                    transition-all duration-200 ease-in-out
                    ${selectedProject?.id === project.id ? "scale-125 ring-2 sm:ring-4 ring-white/70 bg-black" : "hover:scale-110"}
                    drop-shadow-lg
                  `}
                    style={{
                      boxShadow: "0 0 15px rgba(255, 255, 255, 0.4), 0 0 30px rgba(255, 255, 255, 0.2)",
                    }}
                  >
                    {/* Inner pulse effect */}
                    <div className="w-full h-full rounded-full animate-pulse opacity-40 bg-gradient-to-br from-red-900 via-gray-950 to-blue-900"></div>
                  </div>

                  {/* Responsive Project Number */}
                  <div className="absolute -top-6 sm:-top-8 md:-top-10 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-[10px] sm:text-xs md:text-sm font-bold px-1 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-full border border-white/20 shadow-lg whitespace-nowrap">
                    {project.id.split("-")[1]}
                  </div>

                  {/* Enhanced Hover Tooltip - Responsive */}
                  <div className="absolute top-6 sm:top-8 md:top-10 left-1/2 transform -translate-x-1/2 bg-black/95 text-white text-[10px] sm:text-xs md:text-sm px-2 sm:px-3 md:px-4 py-1 sm:py-2 md:py-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-30 pointer-events-none border border-white/20 shadow-2xl hidden sm:block">
                    <div className="font-semibold">{project.name}</div>
                    <div className="text-gray-300">{project.nameAr}</div>
                    <div className="flex items-center gap-1 mt-1">
                      <span>{categoryIcons[project.category]}</span>
                      <span className="text-xs">{statusLabels[project.status]}</span>
                    </div>
                  </div>
                </div>
              )
            })}
        </div>

        {/* Mobile Bottom Sheet / Desktop Side Panel */}
        {selectedProject && (
          <>
            {/* Mobile Bottom Sheet */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-gray-800 border-t border-gray-700 rounded-t-2xl max-h-[50vh] overflow-y-auto">
              <div className="p-4">
                {/* Handle bar */}
                <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-4"></div>

                <Card className="bg-gray-700 border-gray-600">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white flex items-center gap-2 text-lg">
                      <span>{categoryIcons[selectedProject.category]}</span>
                      {selectedProject.name}
                    </CardTitle>
                    <p className="text-gray-300 text-sm">{selectedProject.nameAr}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span className={`px-2 py-1 rounded text-xs text-white ${statusColors[selectedProject.status]}`}>
                        {statusLabels[selectedProject.status]}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      <span className="capitalize text-sm">{selectedProject.category}</span>
                    </div>

                    <p className="text-gray-300 text-sm">{selectedProject.description}</p>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedProject(null)} className="flex-1">
                        Close
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          router.push(
                            `/dashboard/${selectedProject.id}?name=${encodeURIComponent(selectedProject.name)}&nameAr=${encodeURIComponent(selectedProject.nameAr)}`,
                          )
                        }}
                        className="flex-1"
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Desktop Side Panel */}
            <div className="hidden md:block w-96 bg-gray-800 border-l border-gray-700 overflow-y-auto">
              <div className="p-6">
                <Card className="bg-gray-700 border-gray-600">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <span>{categoryIcons[selectedProject.category]}</span>
                      {selectedProject.name}
                    </CardTitle>
                    <p className="text-gray-300">{selectedProject.nameAr}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span className={`px-2 py-1 rounded text-xs text-white ${statusColors[selectedProject.status]}`}>
                        {statusLabels[selectedProject.status]}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      <span className="capitalize">{selectedProject.category}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm text-gray-300">
                        Position: {selectedProject.percentageCoordinates[0].toFixed(1)}%,{" "}
                        {selectedProject.percentageCoordinates[1].toFixed(1)}%
                      </span>
                    </div>

                    <p className="text-gray-300">{selectedProject.description}</p>

                    <Button
                      className="w-full mt-4"
                      onClick={() => {
                        router.push(
                          `/dashboard/${selectedProject.id}?name=${encodeURIComponent(selectedProject.name)}&nameAr=${encodeURIComponent(selectedProject.nameAr)}`,
                        )
                      }}
                    >
                      View Project Details
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
