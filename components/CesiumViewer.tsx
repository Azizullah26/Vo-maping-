"use client"

import { useEffect, useRef, useState } from "react"
import { ZoomIn, ZoomOut, Maximize2, RotateCw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CesiumViewerProps {
  onError?: (error: Error) => void
}

export default function CesiumViewer({ onError }: CesiumViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [cesiumLoaded, setCesiumLoaded] = useState(false)
  const viewerContainer = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<any>(null)

  useEffect(() => {
    if (!viewerContainer.current) return

    let cleanup: (() => void) | null = null

    const loadCesium = async () => {
      try {
        // Dynamically import Cesium
        const Cesium = await import("cesium")

        // Import Cesium CSS
        await import("cesium/Build/Cesium/Widgets/widgets.css")

        // Initialize Cesium ion access token with the new token
        Cesium.Ion.defaultAccessToken =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3OTczZjU2OC1iMGYzLTQyZDItOTA2YS04NWE1MzhlM2NmZjEiLCJpZCI6Mjc3MzUwLCJpYXQiOjE3NDA3NDI1MDR9.AK1fWEGfj9fl0nMFrwy8DagqDiqk1HahP-26nzxutpM"

        // Initialize the Cesium Viewer with minimal configuration to avoid asset loading errors
        viewerRef.current = new Cesium.Viewer(viewerContainer.current, {
          // Use EllipsoidTerrainProvider which doesn't require any external assets
          terrainProvider: new Cesium.EllipsoidTerrainProvider(),

          // Use the default Bing Maps imagery provider that comes with Cesium
          imageryProvider: new Cesium.BingMapsImageryProvider({
            url: "https://dev.virtualearth.net",
            key: Cesium.BingMapsApi.defaultKey,
            mapStyle: Cesium.BingMapsStyle.AERIAL,
          }),

          // Disable features that might try to load additional assets
          baseLayerPicker: false,
          timeline: false,
          animation: false,
          homeButton: false,
          navigationHelpButton: false,
          sceneModePicker: false,
          geocoder: false,
          fullscreenButton: false,
          scene3DOnly: true,
          infoBox: false,
          selectionIndicator: false,
          shadows: false,

          // Disable automatic asset loading
          requestRenderMode: true,
          maximumRenderTimeChange: Number.POSITIVE_INFINITY,
        })

        // Set initial camera position to Al Ain
        viewerRef.current.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(55.74523, 24.21089, 50000.0),
          orientation: {
            heading: Cesium.Math.toRadians(0.0),
            pitch: Cesium.Math.toRadians(-45.0),
            roll: 0.0,
          },
          duration: 3,
        })

        setCesiumLoaded(true)
        setIsLoading(false)

        // Setup cleanup function
        cleanup = () => {
          if (viewerRef.current) {
            try {
              viewerRef.current.destroy()
              viewerRef.current = null
            } catch (err) {
              console.error("Error cleaning up viewer:", err)
            }
          }
        }
      } catch (err) {
        console.error("Failed to load Cesium:", err)
        onError?.(err instanceof Error ? err : new Error("Failed to initialize Cesium viewer"))
        setIsLoading(false)
      }
    }

    loadCesium()

    return () => {
      if (cleanup) cleanup()
    }
  }, [onError])

  const handleZoomIn = () => {
    if (!viewerRef.current || !cesiumLoaded) return

    try {
      const cameraHeight = viewerRef.current.camera.positionCartographic.height
      viewerRef.current.camera.zoomIn(cameraHeight * 0.5)
    } catch (err) {
      console.error("Error handling zoom in:", err)
    }
  }

  const handleZoomOut = () => {
    if (!viewerRef.current || !cesiumLoaded) return

    try {
      const cameraHeight = viewerRef.current.camera.positionCartographic.height
      viewerRef.current.camera.zoomOut(cameraHeight * 0.5)
    } catch (err) {
      console.error("Error handling zoom out:", err)
    }
  }

  const handleRotate = () => {
    if (!viewerRef.current || !cesiumLoaded) return

    try {
      const Cesium = require("cesium")
      const currentHeading = viewerRef.current.camera.heading
      viewerRef.current.camera.setView({
        orientation: {
          heading: currentHeading + Cesium.Math.toRadians(45.0),
          pitch: viewerRef.current.camera.pitch,
          roll: viewerRef.current.camera.roll,
        },
      })
    } catch (err) {
      console.error("Error handling rotation:", err)
    }
  }

  const handleHome = () => {
    if (!viewerRef.current || !cesiumLoaded) return

    try {
      const Cesium = require("cesium")
      viewerRef.current.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(55.74523, 24.21089, 50000.0),
        orientation: {
          heading: Cesium.Math.toRadians(0.0),
          pitch: Cesium.Math.toRadians(-45.0),
          roll: 0.0,
        },
        duration: 2,
      })
    } catch (err) {
      console.error("Error handling home view:", err)
    }
  }

  const toggleFullscreen = () => {
    try {
      if (!document.fullscreenElement) {
        viewerContainer.current?.requestFullscreen()
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
    <div className="relative w-full h-full">
      <div ref={viewerContainer} className="w-full h-full">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
            <div className="text-center">
              <div className="mb-4">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
              <p className="text-gray-500">Loading 3D view...</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls overlay */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <Button
          variant="secondary"
          size="icon"
          className="bg-white/90 hover:bg-white shadow-md"
          onClick={handleHome}
          title="Home view"
          disabled={!cesiumLoaded}
        >
          <Home className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="bg-white/90 hover:bg-white shadow-md"
          onClick={handleZoomIn}
          title="Zoom in"
          disabled={!cesiumLoaded}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="bg-white/90 hover:bg-white shadow-md"
          onClick={handleZoomOut}
          title="Zoom out"
          disabled={!cesiumLoaded}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="bg-white/90 hover:bg-white shadow-md"
          onClick={handleRotate}
          title="Rotate view"
          disabled={!cesiumLoaded}
        >
          <RotateCw className="h-4 w-4" />
        </Button>
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
