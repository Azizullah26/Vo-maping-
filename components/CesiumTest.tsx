"use client"

import { useEffect, useRef, useState } from "react"
import * as Cesium from "cesium"
import "cesium/Build/Cesium/Widgets/widgets.css"

export default function CesiumTest() {
  const viewerContainer = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!viewerContainer.current) return

    try {
      // Initialize Cesium ion access token
      Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0NzE2MDk0Ny0xZDEwLTRkNGItODRhYi03ZWFkZjVkZTY3NjIiLCJpZCI6MTg3NDY0LCJpYXQiOjE3MDc0ODQ4Nzl9.RrPd0yOBqEPOlLu-TGjGj-DvBAlp3WfUzhnJ0n7OYb0"

      // Test viewer initialization
      const viewer = new Cesium.Viewer(viewerContainer.current, {
        terrainProvider: Cesium.createWorldTerrain(),
        animation: false,
        timeline: false,
      })

      // Test terrain loading
      viewer.scene.globe.enableLighting = true

      // Set initial camera position to UAE
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(55.2708, 25.2048, 1000000.0),
      })

      setIsLoading(false)

      return () => {
        viewer.destroy()
      }
    } catch (err) {
      console.error("Cesium initialization error:", err)
      setError(err instanceof Error ? err.message : "Failed to initialize Cesium")
      setIsLoading(false)
    }
  }, [])

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        <h3 className="font-semibold">Cesium Access Error:</h3>
        <p>{error}</p>
      </div>
    )
  }

  if (isLoading) {
    return <div className="p-4 bg-gray-50 text-gray-600 rounded-lg">Loading Cesium viewer...</div>
  }

  return <div ref={viewerContainer} className="w-full h-[400px]" />
}
