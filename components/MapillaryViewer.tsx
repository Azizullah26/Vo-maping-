"use client"

import { useEffect } from "react"

interface MapillaryViewerProps {
  accessToken: string
  mapboxAccessToken?: string
  className?: string
  imageId?: string
}

export default function MapillaryViewer({ className = "" }: MapillaryViewerProps) {
  useEffect(() => {
    console.warn(
      "MapillaryViewer: mapillary-js has been removed from dependencies to reduce build size. Please add 'mapillary-js' to package.json if you need street view functionality.",
    )
  }, [])

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Street View Unavailable</h3>
          <p className="text-gray-600 text-sm mb-4">
            Mapillary street view functionality was removed to reduce deployment size. To enable this feature, add
            'mapillary-js' to package.json dependencies.
          </p>
        </div>
      </div>
    </div>
  )
}
