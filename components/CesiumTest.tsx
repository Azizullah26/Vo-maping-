"use client"

import { useEffect, useRef, useState } from "react"
import { useCesiumToken } from "@/hooks/useCesiumToken"

export default function CesiumTest() {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<any>(null)
  const [cesiumLoaded, setCesiumLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { token, loading, error: tokenError } = useCesiumToken()

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

  useEffect(() => {
    if (!cesiumLoaded || !token || !containerRef.current || viewerRef.current) return

    try {
      window.Cesium.Ion.defaultAccessToken = token

      viewerRef.current = new window.Cesium.Viewer(containerRef.current, {
        terrainProvider: window.Cesium.createWorldTerrain(),
      })

      // Test: Add a simple entity
      viewerRef.current.entities.add({
        name: "Test Point",
        position: window.Cesium.Cartesian3.fromDegrees(55.2708, 25.2048),
        point: {
          pixelSize: 10,
          color: window.Cesium.Color.YELLOW,
          outlineColor: window.Cesium.Color.BLACK,
          outlineWidth: 2,
        },
        label: {
          text: "Abu Dhabi Test Point",
          font: "14pt monospace",
          style: window.Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 2,
          verticalOrigin: window.Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new window.Cesium.Cartesian2(0, -9),
        },
      })

      viewerRef.current.camera.setView({
        destination: window.Cesium.Cartesian3.fromDegrees(55.2708, 25.2048, 10000),
      })
    } catch (err) {
      console.error("Error initializing Cesium test viewer:", err)
      setError("Failed to initialize Cesium test viewer")
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
  }, [cesiumLoaded, token])

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-200">
        <p>Loading Cesium Test...</p>
      </div>
    )
  }

  if (tokenError || error) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-red-100 text-red-600">
        <p>Error: {tokenError || error}</p>
      </div>
    )
  }

  return (
    <div className="w-full h-96">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  )
}
