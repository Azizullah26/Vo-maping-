"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"

// Dynamically import CesiumViewer with no SSR
const CesiumViewer = dynamic(() => import("@/components/CesiumViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-lg font-semibold text-gray-700">Loading 3D viewer...</p>
      </div>
    </div>
  ),
})

interface CesiumViewerModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CesiumViewerModal({ isOpen, onClose }: CesiumViewerModalProps) {
  if (!isOpen) return null

  const handleError = (error: Error) => {
    console.error("Error in CesiumViewer:", error)
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col">
        <div className="flex justify-between items-center p-2 sm:p-4 border-b">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Al Ain 3D View</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 min-h-[500px] h-[70vh] relative">
          <iframe
            src="https://ion.cesium.com/stories/viewer/?id=8149f761-66f7-4da4-bef0-2535c22071ac"
            className="w-full h-full min-h-[500px] border-0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ height: "100%" }}
          />
        </div>
      </div>
    </div>
  )
}
