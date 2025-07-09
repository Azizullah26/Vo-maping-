"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, Maximize2, RotateCw, Home, X } from "lucide-react"

interface AlAinTerrainViewerProps {
  onError?: (error: Error) => void
  onClose?: () => void
}

export default function AlAinTerrainViewer({ onError, onClose }: AlAinTerrainViewerProps) {
  const viewerContainer = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [cesiumLoaded, setCesiumLoaded] = useState(false)
  const viewerRef = useRef<any>(null)

  useEffect(() => {
    if (!viewerContainer.current) return

    let cleanup: (() => void) | null = null

    const loadCesium = async () => {
      try {
        // Load Cesium via CDN instead of dynamic import
        const loadScript = (src: string): Promise<void> => {
          return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) {
              resolve()
              return
            }

            const script = document.createElement("script")
            script.src = src
            script.onload = () => resolve()
            script.onerror = () => reject(new Error(`Failed to load script: ${src}`))
            document.head.appendChild(script)
          })
        }

        const loadCSS = (href: string): Promise<void> => {
          return new Promise((resolve, reject) => {
            if (document.querySelector(`link[href="${href}"]`)) {
              resolve()
              return
            }

            const link = document.createElement("link")
            link.rel = "stylesheet"
            link.href = href
            link.onload = () => resolve()
            link.onerror = () => reject(new Error(`Failed to load CSS: ${href}`))
            document.head.appendChild(link)
          })
        }

        // Load Cesium CSS
        await loadCSS("https://cesium.com/downloads/cesiumjs/releases/1.111/Build/Cesium/Widgets/widgets.css")

        // Load Cesium JS
        await loadScript("https://cesium.com/downloads/cesiumjs/releases/1.111/Build/Cesium/Cesium.js")

        // Wait for Cesium to be available
        let attempts = 0
        while (!(window as any).Cesium && attempts < 50) {
          await new Promise((resolve) => setTimeout(resolve, 100))
          attempts++
        }

        if (!(window as any).Cesium) {
          throw new Error("Cesium failed to load")
        }

        const Cesium = (window as any).Cesium

        // Initialize Cesium ion access token
        Cesium.Ion.defaultAccessToken =
          process.env.NEXT_PUBLIC_CESIUM_ACCESS_TOKEN ||
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3OTczZjU2OC1iMGYzLTQyZDItOTA2YS04NWE1MzhlM2NmZjEiLCJpZCI6Mjc3MzUwLCJpYXQiOjE3NDA3NDI1MDR9.AK1fWEGfj9fl0nMFrwy8DagqDiqk1HahP-26nzxutpM"

        // Initialize the Cesium Viewer
        viewerRef.current = new Cesium.Viewer(viewerContainer.current, {
          terrainProvider: await Cesium.createWorldTerrainAsync(),
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
        viewerRef.current.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(55.74523, 24.21089, 5000.0),
          orientation: {
            heading: Cesium.Math.toRadians(0.0),
            pitch: Cesium.Math.toRadians(-45.0),
            roll: 0.0,
          },
          duration: 3,
        })

        // Try to load 3D Tileset if available
        try {
          if (Cesium.Cesium3DTileset) {
            const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(2275207)
            viewerRef.current.scene.primitives.add(tileset)
            console.log("3D Tileset loaded successfully")
          }
        } catch (tilesetError) {
          console.warn("Could not load 3D Tileset:", tilesetError)
          // Continue without the tileset
        }

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
        const error = err instanceof Error ? err : new Error("Failed to initialize terrain viewer")
        setError(error)
        onError?.(error)
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
    if (!viewerRef.current || !cesiumLoaded || !(window as any).Cesium) return

    try {
      const Cesium = (window as any).Cesium
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
    if (!viewerRef.current || !cesiumLoaded || !(window as any).Cesium) return

    try {
      const Cesium = (window as any).Cesium
      viewerRef.current.camera.flyTo({
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
              <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
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
          disabled={!cesiumLoaded}
        >
          <Home className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="bg-white/90 hover:bg-white shadow-md w-10 h-10"
          onClick={handleZoomIn}
          title="Zoom in"
          disabled={!cesiumLoaded}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="bg-white/90 hover:bg-white shadow-md w-10 h-10"
          onClick={handleZoomOut}
          title="Zoom out"
          disabled={!cesiumLoaded}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="bg-white/90 hover:bg-white shadow-md w-10 h-10"
          onClick={handleRotate}
          title="Rotate view"
          disabled={!cesiumLoaded}
        >
          <RotateCw className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="bg-white/90 hover:bg-white shadow-md w-10 h-10"
          onClick={toggleFullscreen}
          title="Toggle fullscreen"
          disabled={!cesiumLoaded}
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
