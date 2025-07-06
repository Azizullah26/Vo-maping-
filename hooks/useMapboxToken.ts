"use client"

import { useState, useEffect } from "react"

export function useMapboxToken() {
  const [token, setToken] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchToken() {
      try {
        // Fetch token from API only (no direct env access)
        const response = await fetch("/api/mapbox-token")

        if (!response.ok) {
          throw new Error(`Failed to fetch Mapbox token: ${response.status}`)
        }

        const data = await response.json()

        if (!data.token) {
          throw new Error("No token returned from API")
        }

        setToken(data.token)
      } catch (err) {
        console.error("Error fetching Mapbox token:", err)
        setError(err instanceof Error ? err.message : String(err))
      } finally {
        setLoading(false)
      }
    }

    fetchToken()
  }, [])

  return { token, loading, error }
}
