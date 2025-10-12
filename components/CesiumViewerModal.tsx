"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CesiumViewerModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CesiumViewerModal({ isOpen, onClose }: CesiumViewerModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-[95vw] h-[90vh] bg-white rounded-lg shadow-2xl">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-2 right-2 z-10 bg-white/90 hover:bg-white shadow-md"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close Cesium viewer</span>
        </Button>
        <iframe
          title="Al Ain Police Projects"
          src="https://ion.cesium.com/stories/viewer/?id=8149f761-66f7-4da4-bef0-2535c22071ac"
          className="w-full h-full rounded-lg"
          allow="fullscreen"
          allowFullScreen
        />
      </div>
    </div>
  )
}
