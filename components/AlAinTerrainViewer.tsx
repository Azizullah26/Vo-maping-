"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, RotateCcw, ZoomIn, ZoomOut, Home, Play, Pause } from "lucide-react"

declare global {
  interface Window {
    Cesium: any
  }
}

interface AlAinTerrainViewerProps {
  className?: string
}

export default function AlAinTerrainViewer({ className = "" }: AlAinTerrainViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null)
  const cesiumViewerRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loadingMessage, setLoadingMessage] = useState("Initializing 3D viewer...")
  const [isPlaying, setIsPlaying] = useState(false)

  // Load Cesium from CDN
  const loadCesium = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.Cesium) {
        resolve()
        return
      }

      setLoadingMessage("Loading Cesium library...")

      // Load CSS first
      const cssLink = document.createElement("link")
      cssLink.rel = "stylesheet"
      cssLink.href = "https://cesium.com/downloads/cesiumjs/releases/1.111/Build/Cesium/Widgets/widgets.css"
      document.head.appendChild(cssLink)

      // Load JavaScript
      const script = document.createElement("script")
      script.src = "https://cesium.com/downloads/cesiumjs/releases/1.111/Build/Cesium/Cesium.js"
      script.async = true
      script.onload = () => {
        if (window.Cesium) {
          resolve()
        } else {
          reject(new Error("Cesium failed to load properly"))
        }
      }
      script.onerror = () => reject(new Error("Failed to load Cesium script"))
      document.head.appendChild(script)
    })
  }

  const initializeCesiumViewer = async () => {
    if (!viewerRef.current || !window.Cesium) return

    try {
      setLoadingMessage("Setting up 3D terrain...")

      // Use hardcoded Cesium Ion access token
      window.Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlYWE1OWUxNy1mMWZiLTQzYjYtYTQ0OS1kMWFjYmFkNjc5YzciLCJpZCI6NTc3MzMsImlhdCI6MTYyNzg0NTE4Mn0.XcKpgANiY19MC4bdFUXMVEBToBmqS8kuYUlY5x2-H8E"

      const viewer = new window.Cesium.Viewer(viewerRef.current, {
        terrainProvider: await window.Cesium.createWorldTerrainAsync({
          requestWaterMask: true,
          requestVertexNormals: true,
        }),
        imageryProvider: new window.Cesium.ArcGisMapServerImageryProvider({
          url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
        }),
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        animation: false,
        timeline: false,
        fullscreenButton: false,
        vrButton: false,
      })

      cesiumViewerRef.current = viewer

      // Set initial view to Al Ain area
      const alAinPosition = window.Cesium.Cartesian3.fromDegrees(55.7558, 24.2084, 15000)
      viewer.camera.setView({
        destination: alAinPosition,
        orientation: {
          heading: window.Cesium.Math.toRadians(0),
          pitch: window.Cesium.Math.toRadians(-45),
          roll: 0.0,
        },
      })

      setLoadingMessage("Loading 3D models...")

      // Add 3D tileset for Al Ain buildings (if available)
      try {
        const tileset = await window.Cesium.Cesium3DTileset.fromUrl("https://assets.cesium.com/43978/tileset.json")
        viewer.scene.primitives.add(tileset)

        // Adjust tileset position to Al Ain coordinates
        const transform = window.Cesium.Transforms.eastNorthUpToFixedFrame(
          window.Cesium.Cartesian3.fromDegrees(55.7558, 24.2084, 0),
        )
        tileset.modelMatrix = transform
      } catch (tilesetError) {
        console.warn("3D tileset not available, continuing with terrain only")
      }

      setIsLoading(false)
      setError(null)
    } catch (err) {
      console.error("Error initializing Cesium viewer:", err)
      setError("Failed to initialize 3D viewer. Please try again.")
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const initViewer = async () => {
      try {
        await loadCesium()
        await initializeCesiumViewer()
      } catch (err) {
        console.error("Error loading Cesium:", err)
        setError("Failed to load 3D viewer. Please refresh the page.")
        setIsLoading(false)
      }
    }

    initViewer()

    return () => {
      if (cesiumViewerRef.current) {
        cesiumViewerRef.current.destroy()
        cesiumViewerRef.current = null
      }
    }
  }, [])

  const handleZoomIn = () => {
    if (cesiumViewerRef.current) {
      const camera = cesiumViewerRef.current.camera
      const moveAmount = camera.positionCartographic.height * 0.1
      camera.moveForward(moveAmount)
    }
  }

  const handleZoomOut = () => {
    if (cesiumViewerRef.current) {
      const camera = cesiumViewerRef.current.camera
      const moveAmount = camera.positionCartographic.height * 0.1
      camera.moveBackward(moveAmount)
    }
  }

  const handleReset = () => {
    if (cesiumViewerRef.current && window.Cesium) {
      const alAinPosition = window.Cesium.Cartesian3.fromDegrees(55.7558, 24.2084, 15000)
      cesiumViewerRef.current.camera.setView({
        destination: alAinPosition,
        orientation: {
          heading: window.Cesium.Math.toRadians(0),
          pitch: window.Cesium.Math.toRadians(-45),
          roll: 0.0,
        },
      })
    }
  }

  const handleHome = () => {
    if (cesiumViewerRef.current) {
      cesiumViewerRef.current.camera.viewHome()
    }
  }

  const toggleAnimation = () => {
    if (cesiumViewerRef.current) {
      const clock = cesiumViewerRef.current.clock
      if (isPlaying) {
        clock.shouldAnimate = false
        setIsPlaying(false)
      } else {
        clock.shouldAnimate = true
        setIsPlaying(true)
      }
    }
  }

  if (error) {
    return (
      <Card className={`w-full h-[600px] ${className}`}>
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={`relative w-full h-[600px] ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
          <Card className="p-6">
            <CardContent className="flex items-center space-x-4">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>{loadingMessage}</span>
            </CardContent>
          </Card>
        </div>
      )}

      <div ref={viewerRef} className="w-full h-full" />

      {!isLoading && (
        <div className="absolute top-4 right-4 flex flex-col space-y-2 z-10">
          <Button size="sm" variant="secondary" onClick={handleZoomIn} className="bg-white/90 hover:bg-white">
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="secondary" onClick={handleZoomOut} className="bg-white/90 hover:bg-white">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="secondary" onClick={handleReset} className="bg-white/90 hover:bg-white">
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="secondary" onClick={handleHome} className="bg-white/90 hover:bg-white">
            <Home className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="secondary" onClick={toggleAnimation} className="bg-white/90 hover:bg-white">
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
        </div>
      )}

      {!isLoading && (
        <div className="absolute bottom-4 left-4 z-10">
          <Card className="bg-white/90">
            <CardContent className="p-3">
              <h3 className="font-semibold text-sm">Al Ain 3D Terrain</h3>
              <p className="text-xs text-gray-600">Interactive 3D visualization</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
