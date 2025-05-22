"use client"

import { useEffect, useState } from "react"
import { Move3D, Search } from "lucide-react"

const MapInstructionWidget = () => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 4000)

    return () => clearTimeout(timer)
  }, [])

  return (
    isVisible && (
      <div
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white p-4 rounded-lg shadow-lg z-50 transition-opacity duration-500"
        style={{ opacity: isVisible ? 1 : 0 }}
      >
        <div className="flex items-center justify-center gap-4">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Search className="h-5 w-5" />
            </div>
            <p className="text-xs mt-1">Zoom</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Move3D className="h-5 w-5" />
            </div>
            <p className="text-xs mt-1">Move</p>
          </div>
        </div>
        <p className="text-center text-sm mt-2">Zoom and Move to select a location</p>
      </div>
    )
  )
}

export default MapInstructionWidget
