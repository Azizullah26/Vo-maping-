"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Viewer } from "cesium"
import "cesium/Build/Cesium/Widgets/widgets.css"

const CesiumTest: React.FC = () => {
  const [token, setToken] = useState<string | null>(null)

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
    if (token) {
      const viewer = new Viewer("cesiumContainer", {
        terrainProvider: Viewer.createWorldTerrain(),
        accessToken: token,
      })

      return () => {
        viewer.destroy()
      }
    }
  }, [token])

  return <div id="cesiumContainer" style={{ width: "100%", height: "600px" }} />
}

export default CesiumTest
