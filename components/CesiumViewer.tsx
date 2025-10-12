"use client"

import { useEffect, useRef, useState } from "react"
import { ZoomIn, ZoomOut, Maximize2, RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import * as Cesium from "cesium"
import "cesium/Build/Cesium/Widgets/widgets.css"

interface CesiumViewerProps {
  onError?: (error: Error) => void
}

export default function CesiumViewer({ onError }: CesiumViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const viewerContainer = useRef<HTMLDivElement>(null)
  const viewer = useRef<Cesium.Viewer | null>(null)

  useEffect(() => {
    if (!viewerContainer.current) return

    try {
      // Initialize Cesium ion access token
      Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0NzE2MDk0Ny0xZDEwLTRkNGItODRhYi03ZWFkZjVkZTY3NjIiLCJpZCI6MTg3NDY0LCJpYXQiOjE3MDc0ODQ4Nzl9.RrPd0yOBqEPOlLu-TGjGj-DvBAlp3WfUzhnJ0n7OYb0"

      // Initialize the Cesium Viewer
      viewer.current = new Cesium.Viewer(viewerContainer.current, {
        terrainProvider: Cesium.createWorldTerrain(),
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
        shadows: true,
      })

      // Set initial camera position to Al Ain
      viewer.current.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(55.74523, 24.21089, 50000.0),
        orientation: {
          heading: Cesium.Math.toRadians(0.0),
          pitch: Cesium.Math.toRadians(-45.0),
          roll: 0.0,
        },
        duration: 3,
      })

      // Load 3D Tileset
      const tileset = viewer.current.scene.primitives.add(
        new Cesium.Cesium3DTileset({
          url: Cesium.IonResource.fromAssetId(2275207),
        }),
      )

      tileset.readyPromise
        .then(() => {
          console.log("3D Tileset loaded successfully")
          setIsLoading(false)
        })
        .catch((error) => {
          console.error("Error loading 3D Tileset:", error)
          onError?.(new Error("Failed to load 3D Tileset"))
        })

      return () => {
        if (viewer.current) {
          viewer.current.destroy()
          viewer.current = null
        }
      }
    } catch (error) {
      console.error("Error initializing Cesium viewer:", error)
      onError?.(error instanceof Error ? error : new Error("Failed to initialize Cesium viewer"))
    }
  }, [onError])

  const handleZoomIn = () => {
    if (viewer.current) {
      viewer.current.camera.zoomIn(viewer.current.camera.positionCartographic.height * 0.5)
    }
  }

  const handleZoomOut = () => {
    if (viewer.current) {
      viewer.current.camera.zoomOut(viewer.current.camera.positionCartographic.height * 0.5)
    }
  }

  const handleRotate = () => {
    if (viewer.current) {
      const currentHeading = viewer.current.camera.heading
      viewer.current.camera.setView({
        orientation: {
          heading: currentHeading + Cesium.Math.toRadians(45.0),
          pitch: viewer.current.camera.pitch,
          roll: viewer.current.camera.roll,
        },
      })
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      viewerContainer.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <div ref={viewerContainer} className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
          <div className="text-center">
            <div className="mb-4">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
            <p className="text-gray-500">Loading Al Ain 3D view...</p>
          </div>
        </div>
      )}

      {/* Controls overlay */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <Button
          variant="secondary"
          size="icon"
          className="bg-white/90 hover:bg-white shadow-md"
          onClick={handleZoomIn}
          title="Zoom in"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="bg-white/90 hover:bg-white shadow-md"
          onClick={handleZoomOut}
          title="Zoom out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="bg-white/90 hover:bg-white shadow-md"
          onClick={handleRotate}
          title="Rotate view"
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
