"use client"

import { useState, useRef, useEffect } from "react"
import dynamic from "next/dynamic"
import AlAinLeftSlider from "../components/AlAinLeftSlider" // Assuming this component exists
import RightSliderButton from "../components/RightSliderButton" // Assuming this component exists
import PoliceData from "../data/police_locations.json"

// Dynamically import AlAinMap
const AlAinMap = dynamic(() => import("../components/AlAinMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-200">
      <p>Loading Map...</p>
    </div>
  ),
})

// function classNames(...classes: string[]) {
//   return classes.filter(Boolean).join(" ")
// }

export default function HomePage() {
  const [isLeftSliderOpen, setIsLeftSliderOpen] = useState(false)
  const [isRightSliderOpen, setIsRightSliderOpen] = useState(false)
  const [terrainEnabled, setTerrainEnabled] = useState(false)
  const [policeLocations, setPoliceLocations] = useState(PoliceData.police_stations) // Adjusted to match typical JSON structure
  const [selectedProject, setSelectedProject] = useState<{
    id: number
    imageSrc: string
    projectNameAr: string
    projectNameEn: string
    coordinates: [number, number]
  } | null>(null)

  // Explicitly type mapRef for better type safety with the exposed toggleTerrain method
  const mapRef = useRef<{ toggleTerrain: (currentTerrainEnabled: boolean) => void } | null>(null)
  const rightSliderRef = useRef(null) // Keep as is if its usage is generic

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
      mapRef.current.toggleTerrain(terrainEnabled) // Pass current state, component will flip it
      setTerrainEnabled(!terrainEnabled) // Update local state
    } else {
      console.warn("Map reference or toggleTerrain function not available.")
    }
  }

  // Ensure policeLocations is correctly initialized
  useEffect(() => {
    // Assuming PoliceData is { "police_stations": [...] }
    // If PoliceData is directly an array, use setPoliceLocations(PoliceData)
    if (PoliceData && Array.isArray(PoliceData.police_stations)) {
      setPoliceLocations(PoliceData.police_stations)
    } else if (Array.isArray(PoliceData)) {
      setPoliceLocations(PoliceData)
    } else {
      console.error("PoliceData is not in the expected format:", PoliceData)
      setPoliceLocations([]) // Default to empty array on error
    }
  }, [])

  return (
    <div className="relative h-screen w-screen">
      <AlAinMap
        policeLocations={policeLocations}
        onToggleTerrain={setTerrainEnabled} // Pass setter for internal map state if needed
        mapRef={mapRef}
        rightSliderRef={rightSliderRef} // Pass if AlAinMap uses it
      />

      {/* Left Slider - Assuming AlAinLeftSlider and RightSliderButton are correctly implemented */}
      <AlAinLeftSlider
        isOpen={isLeftSliderOpen}
        toggleSlider={toggleLeftSlider}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
      />

      {/* Right Slider Button */}
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
