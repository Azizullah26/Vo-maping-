"use client"

import { useEffect, useRef, useState } from "react"
import { useCesiumToken } from "@/hooks/useCesiumToken"

export default function CesiumTest() {
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

    const initializeCesiumTest = async () => {
      try {
        // Dynamically import Cesium
        const Cesium = await import("cesium")

        // Set the access token
        Cesium.Ion.defaultAccessToken = token

        if (!isMounted || !containerRef.current) return

        // Create a simple test viewer
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

        // Test view - UAE region
        viewer.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(54.3773, 24.4539, 200000),
        })

        // Add a test entity
        viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(54.3773, 24.4539),
          point: {
            pixelSize: 10,
            color: Cesium.Color.YELLOW,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
          },
          label: {
            text: "UAE Test Point",
            font: "14pt monospace",
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 2,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -9),
          },
        })

        setIsLoading(false)
      } catch (err) {
        console.error("Error initializing Cesium Test:", err)
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to initialize Cesium Test")
          setIsLoading(false)
        }
      }
    }

    initializeCesiumTest()

    return () => {
      isMounted = false
      if (viewerRef.current) {
        viewerRef.current.destroy()
        viewerRef.current = null
      }
    }
  }, [token, tokenLoading, tokenError])

  if (tokenLoading || isLoading) {
    return (
      <div className="flex items-center justify-center bg-gray-100 h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading Cesium test viewer...</p>
        </div>
      </div>
    )
  }

  if (error || tokenError) {
    return (
      <div className="flex items-center justify-center bg-red-50 h-96">
        <div className="text-center text-red-600">
          <p>Error loading Cesium test viewer</p>
          <p className="text-sm mt-1">{error || tokenError}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-96">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  )
}
