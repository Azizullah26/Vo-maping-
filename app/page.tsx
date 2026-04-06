"use client"

import { useState, useRef, useEffect } from "react"
import dynamic from "next/dynamic"
import { ErrorBoundary } from "@/app/components/ErrorBoundary"

// Dynamically import components with better error handling
const AlAinMap = dynamic(() => import("../components/AlAinMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-200">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-gray-600">Loading Map...</p>
      </div>
    </div>
  ),
})

const AlAinLeftSlider = dynamic(() => import("../components/AlAinLeftSlider"), {
  ssr: false,
  loading: () => null,
})

const RightSliderButton = dynamic(() => import("../components/RightSliderButton"), {
  ssr: false,
  loading: () => null,
})

// Default police data
const defaultPoliceData = {
  police_stations: [
    {
      name: "مركز شرطة الوقن",
      coordinates: [55.7, 24.2] as [number, number],
      type: "police_station",
      description: "Al Wagan Police Station",
    },
  ],
}

export default function HomePage() {
  const [isLeftSliderOpen, setIsLeftSliderOpen] = useState(false)
  const [isRightSliderOpen, setIsRightSliderOpen] = useState(false)
  const [terrainEnabled, setTerrainEnabled] = useState(false)
  const [policeLocations, setPoliceLocations] = useState(defaultPoliceData.police_stations)
  const [selectedProject, setSelectedProject] = useState<{
    id: number
    imageSrc: string
    projectNameAr: string
    projectNameEn: string
    coordinates: [number, number]
  } | null>(null)
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const mapRef = useRef<{ toggleTerrain: (currentTerrainEnabled: boolean) => void } | null>(null)
  const rightSliderRef = useRef(null)

  // Load police data safely
  useEffect(() => {
    const loadPoliceData = async () => {
      try {
        const PoliceData = await import("../data/police_locations.json")

        // Handle different possible JSON structures
        if (Array.isArray(PoliceData.default)) {
          setPoliceLocations(PoliceData.default)
        } else if (PoliceData && Array.isArray(PoliceData.police_stations)) {
          setPoliceLocations(PoliceData.police_stations)
        } else if (Array.isArray(PoliceData)) {
          setPoliceLocations(PoliceData)
        } else {
          console.warn("Police data not in expected format, using default")
          setPoliceLocations(defaultPoliceData.police_stations)
        }
      } catch (error) {
        console.error("Error loading police data:", error)
        setPoliceLocations(defaultPoliceData.police_stations)
      } finally {
        setIsLoading(false)
      }
    }

    loadPoliceData()
  }, [])

  // Global error handler
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("Global error:", event.error || event.message)
      // Don't set hasError for minor script errors
      if (event.message !== "Script error.") {
        setHasError(true)
      }
      return true
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled promise rejection:", event.reason)
      // Only set error for critical rejections
      if (event.reason && event.reason.message && !event.reason.message.includes("Loading chunk")) {
        setHasError(true)
      }
      event.preventDefault()
    }

    window.addEventListener("error", handleError)
    window.addEventListener("unhandledrejection", handleUnhandledRejection)

    return () => {
      window.removeEventListener("error", handleError)
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
    }
  }, [])

  const toggleLeftSlider = () => {
    try {
      setIsLeftSliderOpen(!isLeftSliderOpen)
    } catch (error) {
      console.error("Error toggling left slider:", error)
    }
  }

  const toggleRightSlider = () => {
    try {
      setIsRightSliderOpen(!isRightSliderOpen)
    } catch (error) {
      console.error("Error toggling right slider:", error)
    }
  }

  const closeRightSlider = () => {
    try {
      setIsRightSliderOpen(false)
    } catch (error) {
      console.error("Error closing right slider:", error)
    }
  }

  const openLeftSlider = (project: any) => {
    try {
      setSelectedProject(project)
      setIsLeftSliderOpen(true)
    } catch (error) {
      console.error("Error opening left slider:", error)
    }
  }

  const handleToggleTerrain = () => {
    try {
      if (mapRef.current && typeof mapRef.current.toggleTerrain === "function") {
        mapRef.current.toggleTerrain(terrainEnabled)
        setTerrainEnabled(!terrainEnabled)
      } else {
        console.warn("Map reference or toggleTerrain function not available.")
      }
    } catch (error) {
      console.error("Error toggling terrain:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-semibold">Loading application...</p>
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-200">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">Something went wrong</p>
          <button
            onClick={() => {
              setHasError(false)
              window.location.reload()
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <ErrorBoundary
        fallback={
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <div className="text-center">
              <p className="text-lg font-semibold mb-2">Map failed to load</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Refresh Page
              </button>
            </div>
          </div>
        }
      >
        <AlAinMap
          policeLocations={policeLocations}
          onToggleTerrain={setTerrainEnabled}
          mapRef={mapRef}
          rightSliderRef={rightSliderRef}
        />

        <AlAinLeftSlider
          isOpen={isLeftSliderOpen}
          toggleSlider={toggleLeftSlider}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
        />

        <RightSliderButton
          isOpen={isRightSliderOpen}
          onClose={closeRightSlider}
          toggleProjects={toggleRightSlider}
          openLeftSlider={openLeftSlider}
        />
      </ErrorBoundary>
    </div>
  )
}
