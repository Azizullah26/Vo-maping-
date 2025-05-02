"use client"

import { useEffect, useRef, useState } from "react"
import * as Cesium from "cesium"
import "cesium/Build/Cesium/Widgets/widgets.css"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, Maximize2, RotateCw, Home, X } from "lucide-react"

interface AlAinTerrainViewerProps {
  onError?: (error: Error) => void
  onClose?: () => void
}

export default function AlAinTerrainViewer({ onError, onClose }: AlAinTerrainViewerProps) {
  const viewerContainer = useRef<HTMLDivElement>(null)
  const viewer = useRef<Cesium.Viewer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!viewerContainer.current) return

    try {
      // Initialize Cesium ion access token
      Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0NzE2MDk0Ny0xZDEwLTRkNGItODRhYi03ZWFkZjVkZTY3NjIiLCJpZCI6MTg3NDY0LCJpYXQiOjE3MDc0ODQ4Nzl9.RrPd0yOBqEPOlLu-TGjGj-DvBAlp3WfUzhnJ0n7OYb0"

      // Initialize the Cesium Viewer with high-resolution terrain
      viewer.current = new Cesium.Viewer(viewerContainer.current, {
        terrainProvider: Cesium.createWorldTerrain({
          requestVertexNormals: true,
          requestWaterMask: true,
        }),
        imageryProvider: new Cesium.IonImageryProvider({ assetId: 3 }),
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
        contextOptions: {
          webgl: {
            alpha: true,
            depth: true,
            stencil: true,
            antialias: true,
            powerPreference: "high-performance",
          },
        },
      })

      // Set initial camera position to Al Ain
      viewer.current.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(55.74523, 24.21089, 5000.0),
        orientation: {
          heading: Cesium.Math.toRadians(0.0),
          pitch: Cesium.Math.toRadians(-45.0),
          roll: 0.0,
        },
        duration: 3,
      })

      // Enable terrain features
      viewer.current.scene.globe.enableLighting = true
      viewer.current.scene.globe.depthTestAgainstTerrain = true
      viewer.current.scene.globe.terrainExaggeration = 1.5

      // Add atmosphere and fog effects
      viewer.current.scene.skyAtmosphere.show = true
      viewer.current.scene.fog.enabled = true
      viewer.current.scene.fog.density = 0.0001
      viewer.current.scene.fog.minimumBrightness = 0.1

      setIsLoading(false)
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to initialize terrain viewer")
      console.error("Terrain viewer initialization error:", error)
      setError(error)
      onError?.(error)
    }

    return () => {
      if (viewer.current) {
        try {
          viewer.current.destroy()
          viewer.current = null
        } catch (err) {
          console.error("Error cleaning up viewer:", err)
        }
      }
    }
  }, [onError])

  const handleZoomIn = () => {
    if (viewer.current) {
      try {
        const cameraHeight = viewer.current.camera.positionCartographic.height
        viewer.current.camera.zoomIn(cameraHeight * 0.5)
      } catch (err) {
        console.error("Error handling zoom in:", err)
      }
    }
  }

  const handleZoomOut = () => {
    if (viewer.current) {
      try {
        const cameraHeight = viewer.current.camera.positionCartographic.height
        viewer.current.camera.zoomOut(cameraHeight * 0.5)
      } catch (err) {
        console.error("Error handling zoom out:", err)
      }
    }
  }

  const handleRotate = () => {
    if (viewer.current) {
      try {
        const currentHeading = viewer.current.camera.heading
        viewer.current.camera.setView({
          orientation: {
            heading: currentHeading + Cesium.Math.toRadians(45.0),
            pitch: viewer.current.camera.pitch,
            roll: viewer.current.camera.roll,
          },
        })
      } catch (err) {
        console.error("Error handling rotation:", err)
      }
    }
  }

  const handleHome = () => {
    if (viewer.current) {
      try {
        viewer.current.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(55.74523, 24.21089, 5000.0),
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

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-red-50 text-red-500">
        <div className="text-center p-4">
          <p className="font-semibold mb-2">Failed to load terrain viewer</p>
          <p className="text-sm text-red-400 mb-4">{error.message}</p>
          <Button
            variant="destructive"
            onClick={() => {
              setError(null)
              window.location.reload()
            }}
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      <div ref={viewerContainer} className="w-full h-full">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-lg font-semibold text-gray-700">Loading 3D terrain...</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls overlay */}
      <div className="fixed bottom-4 right-4 sm:top-4 sm:bottom-auto z-20 flex flex-row sm:flex-col gap-2">
        <Button
          variant="secondary"
          size="icon"
          className="bg-white/90 hover:bg-white shadow-md w-10 h-10"
          onClick={handleHome}
          title="Reset view"
        >
          <Home className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="bg-white/90 hover:bg-white shadow-md w-10 h-10"
          onClick={handleZoomIn}
          title="Zoom in"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="bg-white/90 hover:bg-white shadow-md w-10 h-10"
          onClick={handleZoomOut}
          title="Zoom out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="bg-white/90 hover:bg-white shadow-md w-10 h-10"
          onClick={handleRotate}
          title="Rotate view"
        >
          <RotateCw className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="bg-white/90 hover:bg-white shadow-md w-10 h-10"
          onClick={toggleFullscreen}
          title="Toggle fullscreen"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Close button */}
      <Button
        variant="secondary"
        size="icon"
        className="fixed top-4 left-4 z-20 bg-white/90 hover:bg-white shadow-md w-10 h-10"
        onClick={onClose}
        title="Close terrain viewer"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
