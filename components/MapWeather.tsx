"use client"

import type React from "react"
import { useState } from "react"

interface MapWeatherProps {
  latitude: number
  longitude: number
}

const MapWeather: React.FC<MapWeatherProps> = ({ latitude, longitude }) => {
  const [error] = useState<string | null>(null)

  return (
    <div style={{ width: "100%", height: "400px" }} className="flex items-center justify-center bg-gray-100 rounded-lg">
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="text-center p-8">
          <p className="text-gray-600 mb-2">OpenLayers Map Feature Unavailable</p>
          <p className="text-sm text-gray-500">
            Location: {latitude.toFixed(4)}°, {longitude.toFixed(4)}°
          </p>
          <p className="text-xs text-gray-400 mt-2">The map library was removed to reduce deployment size.</p>
        </div>
      )}
    </div>
  )
}

export { MapWeather }
export default MapWeather
