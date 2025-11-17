"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface HealthCheck {
  status: string
  timestamp: string
  checks: {
    envVariables: { status: string; message: string; details?: any }
    database: { status: string; message: string }
    fileSystem: { status: string; message: string }
    dependencies: { status: string; message: string }
  }
}

export default function DeploymentStatusPage() {
  const [healthCheck, setHealthCheck] = useState<HealthCheck | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchHealthCheck = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/deployment-health")
      const data = await response.json()
      setHealthCheck(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch health check")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHealthCheck()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking deployment status...</p>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ok":
      case "healthy":
        return "bg-green-500"
      case "warning":
        return "bg-yellow-500"
      case "error":
      case "unhealthy":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusBadge = (status: string) => {
    const color = getStatusColor(status)
    return <Badge className={`${color} text-white`}>{status.toUpperCase()}</Badge>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Deployment Status</h1>
            <p className="text-gray-600 mt-2">Monitor your application's health and deployment status</p>
          </div>
          <Button onClick={fetchHealthCheck} disabled={loading}>
            Refresh Status
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {healthCheck && (
          <>
            {/* Overall Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Overall Status
                  {getStatusBadge(healthCheck.status)}
                </CardTitle>
                <CardDescription>Last checked: {new Date(healthCheck.timestamp).toLocaleString()}</CardDescription>
              </CardHeader>
              <CardContent>
                {healthCheck.status === "healthy" ? (
                  <div className="flex items-center text-green-600">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    All systems operational
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Issues detected
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Individual Checks */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Environment Variables */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-lg">
                    Environment Variables
                    {getStatusBadge(healthCheck.checks.envVariables.status)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">{healthCheck.checks.envVariables.message}</p>
                  {healthCheck.checks.envVariables.details && (
                    <div className="text-xs text-gray-500 mt-2">
                      <p>Required: {healthCheck.checks.envVariables.details.required}</p>
                      <p>Present: {healthCheck.checks.envVariables.details.present}</p>
                      {healthCheck.checks.envVariables.details.missing?.length > 0 && (
                        <div className="mt-2">
                          <p className="font-semibold text-red-600">Missing:</p>
                          <ul className="list-disc list-inside">
                            {healthCheck.checks.envVariables.details.missing.map((varName: string) => (
                              <li key={varName}>{varName}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Database */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-lg">
                    Database Connection
                    {getStatusBadge(healthCheck.checks.database.status)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{healthCheck.checks.database.message}</p>
                </CardContent>
              </Card>

              {/* File System */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-lg">
                    File System
                    {getStatusBadge(healthCheck.checks.fileSystem.status)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{healthCheck.checks.fileSystem.message}</p>
                </CardContent>
              </Card>

              {/* Dependencies */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-lg">
                    Dependencies
                    {getStatusBadge(healthCheck.checks.dependencies.status)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{healthCheck.checks.dependencies.message}</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Button variant="outline" onClick={() => (window.location.href = "/")}>
                  Go to Home
                </Button>
                <Button variant="outline" onClick={() => (window.location.href = "/al-ain")}>
                  Go to Al Ain Map
                </Button>
                <Button variant="outline" onClick={() => (window.location.href = "/api/health")}>
                  View API Health
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
