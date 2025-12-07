"use client"

import { useRef } from "react"

interface TerrainViewerProps {
  onError?: (error: Error) => void
}

export default function TerrainViewer({ onError }: TerrainViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
      <div className="text-center p-8">
        <p className="text-gray-600 mb-2">3D Terrain Viewer Unavailable</p>
        <p className="text-sm text-gray-500">
          The 3D terrain viewer has been temporarily removed to reduce deployment size.
        </p>
      </div>
    </div>
  )
}
