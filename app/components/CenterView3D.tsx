"use client"

import { useRef, useEffect } from "react"
import { X, RotateCw } from "lucide-react"

interface CenterView3DProps {
  project: {
    name: string
    glbFile: string
  }
  onClose: () => void
}

export function CenterView3D({ project, onClose }: CenterView3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div ref={containerRef} className="relative w-[80vw] h-[80vh] bg-white rounded-lg shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center justify-center h-full">
          <div className="text-center p-8 max-w-md">
            <RotateCw className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-2xl font-bold mb-2 text-gray-700">3D Viewer Unavailable</h3>
            <p className="text-gray-600 mb-4">
              The 3D viewer feature has been temporarily removed to reduce deployment size. We're working on an
              optimized solution.
            </p>
            <p className="text-sm text-gray-500">Project: {project.name}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
