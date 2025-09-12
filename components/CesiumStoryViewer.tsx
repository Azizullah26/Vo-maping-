"use client"

import { useEffect, useRef, useState } from "react"
import { useCesiumToken } from "@/hooks/useCesiumToken"

interface CesiumStoryViewerProps {
  className?: string
  storyId?: string
}

export default function CesiumStoryViewer({ className = "", storyId }: CesiumStoryViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { token, loading: tokenLoading, error: tokenError } = useCesiumToken()

  useEffect(() => {
    if (tokenLoading || !token) return

    if (tokenError) {
      setError(tokenError)
      setIsLoading(false)
      return
    }

    let isMounted = true

    const initializeCesiumStory = async () => {
      try {
        // Dynamically import Cesium
        const Cesium = await import("cesium")

        // Set the access token
        Cesium.Ion.defaultAccessToken = token

        if (!isMounted || !containerRef.current) return

        // Create the viewer with story-specific configuration
        const viewer = new Cesium.Viewer(containerRef.current, {
          terrainProvider: Cesium.createWorldTerrain(),
          homeButton: true,
          sceneModePicker: true,
          baseLayerPicker: true,
          navigationHelpButton: true,
          animation: true,
          timeline: true,
          fullscreenButton: true,
          geocoder: true,
          infoBox: true,
          selectionIndicator: true,
        })

        viewerRef.current = viewer

        // Set initial view to Al Ain area
        viewer.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(55.7558, 24.2084, 50000), // Al Ain coordinates
        })

        // Add some sample data or story elements here
        if (storyId) {
          // Load specific story content based on storyId
          console.log(`Loading story: ${storyId}`)
        }

        setIsLoading(false)
      } catch (err) {
        console.error("Error initializing Cesium Story:", err)
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to initialize Cesium Story")
          setIsLoading(false)
        }
      }
    }

    initializeCesiumStory()

    return () => {
      isMounted = false
      if (viewerRef.current) {
        viewerRef.current.destroy()
        viewerRef.current = null
      }
    }
  }, [token, tokenLoading, tokenError, storyId])

  if (tokenLoading || isLoading) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading Cesium story viewer...</p>
        </div>
      </div>
    )
  }

  if (error || tokenError) {
    return (
      <div className={`flex items-center justify-center bg-red-50 ${className}`}>
        <div className="text-center text-red-600">
          <p>Error loading Cesium story viewer</p>
          <p className="text-sm mt-1">{error || tokenError}</p>
        </div>
      </div>
    )
  }

  return <div ref={containerRef} className={className} />
}
