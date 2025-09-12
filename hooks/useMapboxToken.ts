"use client"

import { useState, useEffect } from "react"

interface MapboxTokenState {
  token: string | null
  loading: boolean
  error: string | null
}

export function useMapboxToken(): MapboxTokenState {
  const [state, setState] = useState<MapboxTokenState>({
    token: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch("/api/mapbox-token")

        if (!response.ok) {
          throw new Error(`Failed to fetch token: ${response.status}`)
        }

        const data = await response.json()

        if (data.error) {
          throw new Error(data.error)
        }

        setState({
          token: data.token,
          loading: false,
          error: null,
        })
      } catch (error) {
        console.error("Error fetching Mapbox token:", error)
        setState({
          token: null,
          loading: false,
          error: error instanceof Error ? error.message : "Failed to fetch Mapbox token",
        })
      }
    }

    fetchToken()
  }, [])

  return state
}
