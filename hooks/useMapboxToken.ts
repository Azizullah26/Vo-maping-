"use client"

import { useState, useEffect } from "react"

interface MapboxTokenState {
  token: string | null
  loading: boolean
  error: string | null
}

export function useMapboxToken() {
  const [state, setState] = useState<MapboxTokenState>({
    token: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let mounted = true

    async function fetchToken() {
      try {
        console.log("[v0] Fetching Mapbox token...")
        const response = await fetch("/api/mapbox-token")

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || `Failed to fetch token: ${response.status}`)
        }

        if (mounted) {
          if (data.token && data.configured) {
            console.log("[v0] Mapbox token loaded successfully")
            setState({
              token: data.token,
              loading: false,
              error: null,
            })
          } else {
            console.warn("[v0] Mapbox token not configured:", data.error)
            setState({
              token: null,
              loading: false,
              error: data.error || "Mapbox token is not configured. Please add MAPBOX_ACCESS_TOKEN environment variable.",
            })
          }
        }
      } catch (error) {
        console.error("[v0] Error fetching Mapbox token:", error)
        if (mounted) {
          setState({
            token: null,
            loading: false,
            error: error instanceof Error ? error.message : "Failed to fetch token",
          })
        }
      }
    }

    fetchToken()

    return () => {
      mounted = false
    }
  }, [])

  return state
}
