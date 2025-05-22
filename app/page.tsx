"use client"

import { useState, useRef } from "react"
import dynamic from "next/dynamic"
import AlAinLeftSlider from "../components/AlAinLeftSlider"
import RightSliderButton from "../components/RightSliderButton"
import PoliceData from "../data/police_locations.json"

const AlAinMap = dynamic(() => import("../components/AlAinMap"), {
  ssr: false,
})

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export default function HomePage() {
  const [isLeftSliderOpen, setIsLeftSliderOpen] = useState(false)
  const [isRightSliderOpen, setIsRightSliderOpen] = useState(false)
  const [terrainEnabled, setTerrainEnabled] = useState(false)
  const [policeLocations, setPoliceLocations] = useState(PoliceData)
  const [selectedProject, setSelectedProject] = useState<{
    id: number
    imageSrc: string
    projectNameAr: string
    projectNameEn: string
    coordinates: [number, number]
  } | null>(null)

  const mapRef = useRef(null)
  const rightSliderRef = useRef(null)

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
    setTerrainEnabled(!terrainEnabled)
    if (mapRef.current) {
      // Access the map instance and toggle terrain
      mapRef.current.toggleTerrain(terrainEnabled)
    }
  }

  return (
    <div className="relative h-screen w-screen">
      <AlAinMap
        policeLocations={policeLocations}
        onToggleTerrain={handleToggleTerrain}
        mapRef={mapRef}
        rightSliderRef={rightSliderRef}
      />

      {/* Left Slider */}
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
