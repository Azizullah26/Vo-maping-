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
        const response = await fetch("/api/mapbox-token")

        if (!response.ok) {
          throw new Error(`Failed to fetch token: ${response.status}`)
        }

        const data = await response.json()

        if (mounted) {
          if (data.token) {
            setState({
              token: data.token,
              loading: false,
              error: null,
            })
          } else {
            setState({
              token: null,
              loading: false,
              error: data.error || "Token not available",
            })
          }
        }
      } catch (error) {
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
