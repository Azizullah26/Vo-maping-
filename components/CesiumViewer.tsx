"use client"

import { useEffect, useRef, useState } from "react"
import { useCesiumToken } from "@/hooks/useCesiumToken"

interface CesiumViewerProps {
  className?: string
  onViewerReady?: (viewer: any) => void
}

export default function CesiumViewer({ className = "", onViewerReady }: CesiumViewerProps) {
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

    const initializeCesium = async () => {
      try {
        // Dynamically import Cesium
        const Cesium = await import("cesium")

        // Set the access token
        Cesium.Ion.defaultAccessToken = token

        if (!isMounted || !containerRef.current) return

        // Create the viewer
        const viewer = new Cesium.Viewer(containerRef.current, {
          terrainProvider: Cesium.createWorldTerrain(),
          homeButton: false,
          sceneModePicker: false,
          baseLayerPicker: false,
          navigationHelpButton: false,
          animation: false,
          timeline: false,
          fullscreenButton: false,
          geocoder: false,
          infoBox: false,
          selectionIndicator: false,
        })

        viewerRef.current = viewer

        // Set initial view to UAE
        viewer.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(54.3773, 24.4539, 100000), // UAE coordinates
        })

        if (onViewerReady) {
          onViewerReady(viewer)
        }

        setIsLoading(false)
      } catch (err) {
        console.error("Error initializing Cesium:", err)
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to initialize Cesium")
          setIsLoading(false)
        }
      }
    }

    initializeCesium()

    return () => {
      isMounted = false
      if (viewerRef.current) {
        viewerRef.current.destroy()
        viewerRef.current = null
      }
    }
  }, [token, tokenLoading, tokenError, onViewerReady])

  if (tokenLoading || isLoading) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading Cesium viewer...</p>
        </div>
      </div>
    )
  }

  if (error || tokenError) {
    return (
      <div className={`flex items-center justify-center bg-red-50 ${className}`}>
        <div className="text-center text-red-600">
          <p>Error loading Cesium viewer</p>
          <p className="text-sm mt-1">{error || tokenError}</p>
        </div>
      </div>
    )
  }

  return <div ref={containerRef} className={className} />
}
