"use client"

import { useEffect, useRef, useState } from "react"
import { Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CesiumStoryViewerProps {
  onError?: (error: Error) => void
  storyId: string
}

export default function CesiumStoryViewer({ onError, storyId }: CesiumStoryViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Set a timeout to detect if loading takes too long
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false)
        onError?.(new Error("Loading timed out. The story might not be publicly accessible."))
      }
    }, 15000) // 15 seconds timeout

    return () => clearTimeout(timeoutId)
  }, [isLoading, onError])

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  const handleIframeError = () => {
    setIsLoading(false)
    onError?.(new Error("Failed to load Cesium Ion story. It might not be publicly accessible."))
  }

  const toggleFullscreen = () => {
    try {
      if (!document.fullscreenElement) {
        containerRef.current?.requestFullscreen()
        setIsFullscreen(true)
      } else {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    } catch (err) {
      console.error("Error toggling fullscreen:", err)
    }
  }

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
          <div className="text-center">
            <div className="mb-4">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
            <p className="text-gray-500">Loading Cesium Ion story...</p>
          </div>
        </div>
      )}

      <iframe
        ref={iframeRef}
        src={`https://ion.cesium.com/stories/viewer/?id=${storyId}`}
        className="w-full h-full border-0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={handleIframeLoad}
        onError={handleIframeError}
      />

      {/* Controls overlay */}
      <div className="absolute top-4 right-4 z-20">
        <Button
          variant="secondary"
          size="icon"
          className="bg-white/90 hover:bg-white shadow-md"
          onClick={toggleFullscreen}
          title="Toggle fullscreen"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
