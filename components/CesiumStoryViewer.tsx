"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Viewer } from "cesium"
import "cesium/Build/Cesium/Widgets/widgets.css"

const CesiumStoryViewer: React.FC = () => {
  const [token, setToken] = useState<string | null>(null)
  const [viewer, setViewer] = useState<Viewer | null>(null)

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch("/api/cesium-token")
        const data = await response.json()
        setToken(data.token)
      } catch (error) {
        console.error("Failed to fetch Cesium token:", error)
      }
    }

    fetchToken()
  }, [])

  useEffect(() => {
    if (token && !viewer) {
      const newViewer = new Viewer("cesiumContainer", {
        terrainProvider: Viewer.createWorldTerrain(),
        accessToken: token,
      })
      setViewer(newViewer)
    }

    return () => {
      if (viewer) {
        viewer.destroy()
      }
    }
  }, [token, viewer])

  return (
    <div id="cesiumContainer" style={{ width: "100%", height: "100vh" }}>
      {/* Cesium viewer will be initialized here */}
    </div>
  )
}

export default CesiumStoryViewer
