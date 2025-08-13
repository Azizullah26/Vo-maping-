"use client"

import { useState, useEffect } from "react"

interface CesiumTokenState {
  token: string | null
  loading: boolean
  error: string | null
}

export function useCesiumToken() {
  const [state, setState] = useState<CesiumTokenState>({
    token: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch("/api/cesium-token")

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
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
        setState({
          token: null,
          loading: false,
          error: error instanceof Error ? error.message : "Failed to fetch Cesium token",
        })
      }
    }

    fetchToken()
  }, [])

  return state
}
