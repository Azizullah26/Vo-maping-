"use client"

import { useState, useCallback, useEffect } from "react"
import AbuDhabiMap from "@/components/AbuDhabiMap"
import { AbuDhabiRightSlider } from "@/components/AbuDhabiRightSlider"
import { LeftProjectSlider } from "@/components/LeftProjectSlider"
import AbuDhabiRightSliderButton from "@/components/AbuDhabiRightSliderButton"

export default function AbuDhabiPage() {
  const [isRightSliderOpen, setIsRightSliderOpen] = useState(false)
  const [isLeftSliderOpen, setIsLeftSliderOpen] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)
  const [isFullyLoaded, setIsFullyLoaded] = useState(false)

  // Ensure map is fully loaded before showing UI elements
  useEffect(() => {
    // Short timeout to ensure map has time to initialize
    const timer = setTimeout(() => {
      setIsFullyLoaded(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const toggleRightSlider = useCallback(() => {
    setIsRightSliderOpen((prev) => !prev)
  }, [])

  const openLeftSlider = useCallback((projectId: number) => {
    setSelectedProjectId(projectId)
    setIsLeftSliderOpen(true)
  }, [])

  const closeLeftSlider = useCallback(() => {
    setIsLeftSliderOpen(false)
    setSelectedProjectId(null)
  }, [])

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden">
      {/* Main content - Full screen map */}
      <div className="absolute inset-0 w-full h-full">
        <AbuDhabiMap key="abu-dhabi-map" />
      </div>

      {/* Toggle buttons */}
      <div className="absolute top-4 right-4 z-[1000] flex gap-2">
        <AbuDhabiRightSliderButton isOpen={isRightSliderOpen} onClick={toggleRightSlider} />
      </div>

      {/* Right slider */}
      <AbuDhabiRightSlider isOpen={isRightSliderOpen} onClose={toggleRightSlider} openLeftSlider={openLeftSlider} />

      {/* Left slider */}
      <LeftProjectSlider isOpen={isLeftSliderOpen} onClose={closeLeftSlider} projectId={selectedProjectId} />
    </div>
  )
}
