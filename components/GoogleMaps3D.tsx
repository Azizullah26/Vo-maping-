"use client"

import type React from "react"

interface GoogleMaps3DProps {
  center: string
  range: string
  tilt: string
  heading: string
}

const GoogleMaps3D: React.FC<GoogleMaps3DProps> = () => {
  return (
    <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
      <p className="text-gray-500">3D Map View (API Key Required)</p>
    </div>
  )
}

export default GoogleMaps3D
