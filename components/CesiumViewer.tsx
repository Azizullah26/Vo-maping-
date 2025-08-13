"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Viewer } from "cesium"
import "cesium/Build/Cesium/Widgets/widgets.css"

const CesiumViewer: React.FC = () => {
  const [cesiumToken, setCesiumToken] = useState<string | null>(null)
  const [viewer, setViewer] = useState<Viewer | null>(null)

  useEffect(() => {
    const fetchCesiumToken = async () => {
      try {
        const response = await fetch("/api/cesium-token")
        if (response.ok) {
          const data = await response.json()
          setCesiumToken(data.token)
        }
      } catch (error) {
        console.error("Failed to fetch Cesium token:", error)
      }
    }

    fetchCesiumToken()
  }, [])

  useEffect(() => {
    if (cesiumToken) {
      const newViewer = new Viewer("cesiumContainer", {
        terrainProvider: Viewer.createWorldTerrain(),
        accessToken: cesiumToken,
      })
      setViewer(newViewer)

      return () => {
        newViewer.destroy()
      }
    }
  }, [cesiumToken])

  return (
    <div id="cesiumContainer" style={{ width: "100%", height: "100vh" }}>
      {/* Cesium viewer will be initialized here */}
    </div>
  )
}

export default CesiumViewer
