"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface DatabaseStatus {
  configured: Record<string, boolean>
  connections: Record<string, { success: boolean; message: string }>
}

export default function DatabaseStatusPage() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStatus() {
      try {
        const response = await fetch("/api/database-status")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setStatus(data)
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to fetch database status")
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Database Status</h1>
        <p>Loading database status...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Database Status</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Database Status</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {status &&
          Object.entries(status.configured).map(([name, isConfigured]) => (
            <Card key={name}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  {isConfigured ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{isConfigured ? "Configured" : "Not configured"}</p>
              </CardContent>
            </Card>
          ))}
      </div>

      <h2 className="text-xl font-bold mb-4">Connection Tests</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {status &&
          Object.entries(status.connections).map(([name, { success, message }]) => (
            <Card key={name}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  {success ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={success ? "text-green-600" : "text-red-600"}>{message}</p>
              </CardContent>
            </Card>
          ))}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Run Database Test</h2>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => (window.location.href = "/api/database-test")}
        >
          Run Test
        </button>
      </div>
    </div>
  )
}
