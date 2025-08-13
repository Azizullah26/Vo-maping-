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
  const [cesiumLoaded, setCesiumLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { token, loading, error: tokenError } = useCesiumToken()

  // Load Cesium from CDN
  useEffect(() => {
    if (typeof window === "undefined") return

    if (window.Cesium) {
      setCesiumLoaded(true)
      return
    }

    const cssLink = document.createElement("link")
    cssLink.rel = "stylesheet"
    cssLink.href = "https://cesium.com/downloads/cesiumjs/releases/1.95/Build/Cesium/Widgets/widgets.css"
    document.head.appendChild(cssLink)

    const script = document.createElement("script")
    script.src = "https://cesium.com/downloads/cesiumjs/releases/1.95/Build/Cesium/Cesium.js"
    script.onload = () => setCesiumLoaded(true)
    script.onerror = () => setError("Failed to load Cesium from CDN")
    document.head.appendChild(script)

    return () => {
      try {
        if (document.head.contains(cssLink)) document.head.removeChild(cssLink)
        if (document.head.contains(script)) document.head.removeChild(script)
      } catch (e) {
        console.warn("Cleanup error:", e)
      }
    }
  }, [])

  // Initialize Cesium story viewer
  useEffect(() => {
    if (!cesiumLoaded || !token || !containerRef.current || viewerRef.current) return

    try {
      window.Cesium.Ion.defaultAccessToken = token

      viewerRef.current = new window.Cesium.Viewer(containerRef.current, {
        terrainProvider: window.Cesium.createWorldTerrain(),
        homeButton: false,
        sceneModePicker: false,
        baseLayerPicker: false,
        navigationHelpButton: false,
        animation: true,
        timeline: true,
        fullscreenButton: false,
        vrButton: false,
        geocoder: false,
        infoBox: true,
        selectionIndicator: true,
      })

      // Load story if provided
      if (storyId) {
        // This would load a specific Cesium story/tour
        console.log(`Loading Cesium story: ${storyId}`)
      }

      // Set initial view for UAE
      viewerRef.current.camera.setView({
        destination: window.Cesium.Cartesian3.fromDegrees(54.3773, 24.4539, 50000),
        orientation: {
          heading: window.Cesium.Math.toRadians(0.0),
          pitch: window.Cesium.Math.toRadians(-30.0),
        },
      })
    } catch (err) {
      console.error("Error initializing Cesium story viewer:", err)
      setError("Failed to initialize Cesium story viewer")
    }

    return () => {
      if (viewerRef.current) {
        try {
          viewerRef.current.destroy()
          viewerRef.current = null
        } catch (e) {
          console.warn("Error destroying Cesium viewer:", e)
        }
      }
    }
  }, [cesiumLoaded, token, storyId])

  if (loading) {
    return (
      <div className={`flex items-center justify-center bg-gray-200 ${className}`}>
        <p>Loading Cesium Story...</p>
      </div>
    )
  }

  if (tokenError || error) {
    return (
      <div className={`flex items-center justify-center bg-red-100 text-red-600 ${className}`}>
        <p>Error: {tokenError || error}</p>
      </div>
    )
  }

  return <div ref={containerRef} className={`w-full h-full ${className}`} />
}
