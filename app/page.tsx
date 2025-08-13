"use client"

import { useState, useRef, useEffect } from "react"
import dynamic from "next/dynamic"
import { ErrorBoundary } from "@/app/components/ErrorBoundary"

// Dynamically import components to avoid SSR issues
const AlAinMap = dynamic(
  () =>
    import("../components/AlAinMap").catch((err) => {
      console.error("Failed to load AlAinMap:", err)
      return {
        default: () => (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <p>Map failed to load</p>
          </div>
        ),
      }
    }),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gray-200">
        <p>Loading Map...</p>
      </div>
    ),
  },
)

const AlAinLeftSlider = dynamic(
  () =>
    import("../components/AlAinLeftSlider").catch((err) => {
      console.error("Failed to load AlAinLeftSlider:", err)
      return { default: () => null }
    }),
  {
    ssr: false,
    loading: () => null,
  },
)

const RightSliderButton = dynamic(
  () =>
    import("../components/RightSliderButton").catch((err) => {
      console.error("Failed to load RightSliderButton:", err)
      return { default: () => null }
    }),
  {
    ssr: false,
    loading: () => null,
  },
)

// Default police data in case import fails
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

  const mapRef = useRef<{ toggleTerrain: (currentTerrainEnabled: boolean) => void } | null>(null)
  const rightSliderRef = useRef(null)

  // Load police data safely
  useEffect(() => {
    const loadPoliceData = async () => {
      try {
        const PoliceData = await import("../data/police_locations.json")
        if (PoliceData && Array.isArray(PoliceData.police_stations)) {
          setPoliceLocations(PoliceData.police_stations)
        } else if (Array.isArray(PoliceData.default)) {
          setPoliceLocations(PoliceData.default)
        } else {
          console.warn("Police data not in expected format, using default")
          setPoliceLocations(defaultPoliceData.police_stations)
        }
      } catch (error) {
        console.error("Failed to load police data:", error)
        setPoliceLocations(defaultPoliceData.police_stations)
      }
    }

    loadPoliceData()
  }, [])

  // Add global error handler for unhandled script errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("Global script error:", event.error)
      setHasError(true)
      return true // Prevent default browser error handling
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled promise rejection:", event.reason)
      setHasError(true)
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
      setHasError(true)
    }
  }

  const toggleRightSlider = () => {
    try {
      setIsRightSliderOpen(!isRightSliderOpen)
    } catch (error) {
      console.error("Error toggling right slider:", error)
      setHasError(true)
    }
  }

  const closeRightSlider = () => {
    try {
      setIsRightSliderOpen(false)
    } catch (error) {
      console.error("Error closing right slider:", error)
      setHasError(true)
    }
  }

  const openLeftSlider = (project: any) => {
    try {
      setSelectedProject(project)
      setIsLeftSliderOpen(true)
    } catch (error) {
      console.error("Error opening left slider:", error)
      setHasError(true)
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
      setHasError(true)
    }
  }

  if (hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-200">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">Something went wrong</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  try {
    return (
      <div className="relative h-screen w-screen">
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
            ref={rightSliderRef}
          />
        </ErrorBoundary>
      </div>
    )
  } catch (error) {
    console.error("Critical error in HomePage:", error)
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-200">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">Critical error occurred</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }
}
