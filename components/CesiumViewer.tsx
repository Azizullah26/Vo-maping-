"use client"

import { useEffect, useRef, useState } from "react"
import { useCesiumToken } from "@/hooks/useCesiumToken"

interface CesiumViewerProps {
  className?: string
  onLoad?: () => void
}

export default function CesiumViewer({ className = "", onLoad }: CesiumViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<any>(null)
  const [cesiumLoaded, setCesiumLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { token, loading, error: tokenError } = useCesiumToken()

  // Load Cesium from CDN
  useEffect(() => {
    if (typeof window === "undefined") return

    // Check if Cesium is already loaded
    if (window.Cesium) {
      setCesiumLoaded(true)
      return
    }

    // Load CSS
    const cssLink = document.createElement("link")
    cssLink.rel = "stylesheet"
    cssLink.href = "https://cesium.com/downloads/cesiumjs/releases/1.95/Build/Cesium/Widgets/widgets.css"
    document.head.appendChild(cssLink)

    // Load JS
    const script = document.createElement("script")
    script.src = "https://cesium.com/downloads/cesiumjs/releases/1.95/Build/Cesium/Cesium.js"
    script.onload = () => {
      setCesiumLoaded(true)
    }
    script.onerror = () => {
      setError("Failed to load Cesium from CDN")
    }
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

  // Initialize Cesium viewer when both Cesium and token are ready
  useEffect(() => {
    if (!cesiumLoaded || !token || !containerRef.current || viewerRef.current) return

    try {
      // Set Cesium access token
      window.Cesium.Ion.defaultAccessToken = token

      // Create viewer
      viewerRef.current = new window.Cesium.Viewer(containerRef.current, {
        terrainProvider: window.Cesium.createWorldTerrain(),
        homeButton: false,
        sceneModePicker: false,
        baseLayerPicker: false,
        navigationHelpButton: false,
        animation: false,
        timeline: false,
        fullscreenButton: false,
        vrButton: false,
        geocoder: false,
        infoBox: false,
        selectionIndicator: false,
      })

      // Set initial view
      viewerRef.current.camera.setView({
        destination: window.Cesium.Cartesian3.fromDegrees(55.2708, 25.2048, 15000),
        orientation: {
          heading: window.Cesium.Math.toRadians(0.0),
          pitch: window.Cesium.Math.toRadians(-45.0),
        },
      })

      onLoad?.()
    } catch (err) {
      console.error("Error initializing Cesium viewer:", err)
      setError("Failed to initialize Cesium viewer")
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
  }, [cesiumLoaded, token, onLoad])

  if (loading) {
    return (
      <div className={`flex items-center justify-center bg-gray-200 ${className}`}>
        <p>Loading Cesium...</p>
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
