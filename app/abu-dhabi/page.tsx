"use client"

import { useState } from "react"
import AbuDhabiMap from "@/components/AbuDhabiMap"
import { AbuDhabiRightSlider } from "@/components/AbuDhabiRightSlider"
import { LeftProjectSlider } from "@/components/LeftProjectSlider"
import AbuDhabiRightSliderButton from "@/components/AbuDhabiRightSliderButton"

export default function AbuDhabiPage() {
  const [isRightSliderOpen, setIsRightSliderOpen] = useState(false)
  const [isLeftSliderOpen, setIsLeftSliderOpen] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)

  const toggleRightSlider = () => {
    setIsRightSliderOpen(!isRightSliderOpen)
  }

  const openLeftSlider = (projectId: number) => {
    setSelectedProjectId(projectId)
    setIsLeftSliderOpen(true)
  }

  const closeLeftSlider = () => {
    setIsLeftSliderOpen(false)
    setSelectedProjectId(null)
  }

  return (
    <div className="relative h-[calc(100vh-4rem)] overflow-hidden">
      {/* Main content */}
      <div className="relative h-full">
        <AbuDhabiMap />
      </div>

      {/* Toggle buttons */}
      <div className="absolute top-4 right-4 z-[100] flex gap-2">
        <AbuDhabiRightSliderButton isOpen={isRightSliderOpen} onClick={toggleRightSlider} />
      </div>

      {/* Right slider */}
      <AbuDhabiRightSlider isOpen={isRightSliderOpen} onClose={toggleRightSlider} openLeftSlider={openLeftSlider} />

      {/* Left slider */}
      <LeftProjectSlider isOpen={isLeftSliderOpen} onClose={closeLeftSlider} projectId={selectedProjectId} />
    </div>
  )
}
