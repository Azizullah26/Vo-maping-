"use client"

import { useState, useRef, useEffect } from "react"
import dynamic from "next/dynamic"

// Dynamically import components to avoid SSR issues
const AlAinMap = dynamic(() => import("../components/AlAinMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-200">
      <p>Loading Map...</p>
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

  const toggleLeftSlider = () => {
    setIsLeftSliderOpen(!isLeftSliderOpen)
  }

  const toggleRightSlider = () => {
    setIsRightSliderOpen(!isRightSliderOpen)
  }

  const closeRightSlider = () => {
    setIsRightSliderOpen(false)
  }

  const openLeftSlider = (project: any) => {
    setSelectedProject(project)
    setIsLeftSliderOpen(true)
  }

  const handleToggleTerrain = () => {
    if (mapRef.current && typeof mapRef.current.toggleTerrain === "function") {
      try {
        mapRef.current.toggleTerrain(terrainEnabled)
        setTerrainEnabled(!terrainEnabled)
      } catch (error) {
        console.warn("Error toggling terrain:", error)
      }
    } else {
      console.warn("Map reference or toggleTerrain function not available.")
    }
  }

  return (
    <div className="relative h-screen w-screen">
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
    </div>
  )
}
