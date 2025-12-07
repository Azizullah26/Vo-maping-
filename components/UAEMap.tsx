"use client"

import type React from "react"

const UAEMap: React.FC = () => {
  return (
    <div style={{ width: "100%", height: "400px" }} className="flex items-center justify-center bg-gray-100 rounded-lg">
      <div className="text-center p-8">
        <p className="text-gray-600 mb-2">UAE Map Feature Unavailable</p>
        <p className="text-sm text-gray-500">Abu Dhabi coordinates: 24.47°N, 54.37°E</p>
        <p className="text-xs text-gray-400 mt-2">The map library was removed to reduce deployment size.</p>
      </div>
    </div>
  )
}

export default UAEMap
