"use client"

import { useState, useEffect } from "react"

export function HealthStatus() {
  const [apiHealth, setApiHealth] = useState<any>(null)
  const [dbHealth, setDbHealth] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchHealthStatus() {
      try {
        setLoading(true)

        // Fetch API health
        const apiResponse = await fetch("/api/health")
        const apiData = await apiResponse.json()
        setApiHealth(apiData)

        // Fetch DB health
        const dbResponse = await fetch("/api/health/database")
        const dbData = await dbResponse.json()
        setDbHealth(dbData)

        setError(null)
      } catch (err) {
        setError("Failed to fetch health status")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchHealthStatus()
  }, [])

  if (loading) return <div>Loading health status...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">System Health</h2>

      {apiHealth && (
        <div className="p-4 border rounded">
          <h3 className="font-semibold">API Status</h3>
          <div className="flex items-center mt-2">
            <div
              className={`w-3 h-3 rounded-full mr-2 ${apiHealth.api.status === "healthy" ? "bg-green-500" : "bg-red-500"}`}
            ></div>
            <span>{apiHealth.api.status}</span>
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Last checked: {new Date(apiHealth.api.timestamp).toLocaleString()}
          </div>
        </div>
      )}

      {dbHealth && (
        <div className="p-4 border rounded">
          <h3 className="font-semibold">Database Status</h3>
          <div className="flex items-center mt-2">
            <div
              className={`w-3 h-3 rounded-full mr-2 ${
                dbHealth.database.status === "healthy"
                  ? "bg-green-500"
                  : dbHealth.database.status === "warning"
                    ? "bg-yellow-500"
                    : "bg-red-500"
              }`}
            ></div>
            <span>{dbHealth.database.status}</span>
          </div>
          {dbHealth.database.message && <div className="text-sm mt-1">{dbHealth.database.message}</div>}
          <div className="text-sm text-gray-500 mt-1">
            Last checked: {new Date(dbHealth.database.timestamp).toLocaleString()}
          </div>
        </div>
      )}

      {apiHealth && apiHealth.environment && (
        <div className="p-4 border rounded">
          <h3 className="font-semibold">Environment</h3>
          <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
            {Object.entries(apiHealth.environment).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="font-medium">{key}:</span>
                <span>{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
