"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Database, AlertCircle, CheckCircle } from "lucide-react"

export default function TestNileConnectionPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [envVars, setEnvVars] = useState<Record<string, boolean>>({})
  const [dbStatus, setDbStatus] = useState<{ isConfigured: boolean; message?: string } | null>(null)

  useEffect(() => {
    const checkEnvironment = async () => {
      try {
        setLoading(true)

        // Check environment variables
        const envResponse = await fetch("/api/env-check")
        if (!envResponse.ok) {
          throw new Error(`Failed to check environment variables: ${envResponse.status}`)
        }
        const envData = await envResponse.json()
        setEnvVars(envData.envVars)

        // Check Nile database status
        const dbResponse = await fetch("/api/nile/init")
        if (!dbResponse.ok) {
          throw new Error(`Failed to check Nile database status: ${dbResponse.status}`)
        }
        const dbData = await dbResponse.json()
        setDbStatus(dbData)
      } catch (error) {
        console.error("Error checking environment:", error)
        setError(error instanceof Error ? error.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    checkEnvironment()
  }, [])

  const handleInitializeDb = async () => {
    try {
      setLoading(true)

      const response = await fetch("/api/nile/init", {
        method: "POST",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Failed to initialize database: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        alert("Database initialized successfully!")
        // Refresh the page to update status
        window.location.reload()
      } else {
        throw new Error(data.message || "Failed to initialize database")
      }
    } catch (error) {
      console.error("Error initializing database:", error)
      setError(error instanceof Error ? error.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Nile Database Connection Test</h1>

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Environment Variables</CardTitle>
              <CardDescription>Check if required environment variables are set</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-8 w-8 ${envVars.NILEDB_URL ? "bg-green-100" : "bg-red-100"} rounded-full flex items-center justify-center`}
                  >
                    {envVars.NILEDB_URL ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">NILEDB_URL</h3>
                    <p className="text-sm text-gray-600">
                      {envVars.NILEDB_URL ? "Environment variable is set" : "Environment variable is not set"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Database Status</CardTitle>
              <CardDescription>Check if the Nile database is configured and accessible</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-8 w-8 ${dbStatus?.isConfigured ? "bg-green-100" : "bg-red-100"} rounded-full flex items-center justify-center`}
                  >
                    <Database className={`h-4 w-4 ${dbStatus?.isConfigured ? "text-green-600" : "text-red-600"}`} />
                  </div>
                  <div>
                    <h3 className="font-medium">Nile Database</h3>
                    <p className="text-sm text-gray-600">
                      {dbStatus?.isConfigured
                        ? "Database is configured and accessible"
                        : "Database is not configured or not accessible"}
                    </p>
                    {dbStatus?.message && <p className="text-sm text-gray-500 mt-1">{dbStatus.message}</p>}
                  </div>
                </div>

                {!dbStatus?.isConfigured && envVars.NILEDB_URL && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-yellow-800 font-medium">
                      The NILEDB_URL environment variable is set, but the database connection failed.
                    </p>
                    <p className="text-yellow-700 text-sm mt-1">
                      This could be due to an incorrect connection string or network issues.
                    </p>
                  </div>
                )}

                {!envVars.NILEDB_URL && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-800 font-medium">The NILEDB_URL environment variable is not set.</p>
                    <p className="text-red-700 text-sm mt-1">Please add this environment variable to your project.</p>
                  </div>
                )}

                {dbStatus?.isConfigured && (
                  <Button onClick={handleInitializeDb} className="mt-4">
                    Initialize Database
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
