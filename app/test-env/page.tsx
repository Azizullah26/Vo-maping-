"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function TestEnvPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [envVars, setEnvVars] = useState<Record<string, any>>({})

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
      } catch (error) {
        console.error("Error checking environment:", error)
        setError(error instanceof Error ? error.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    checkEnvironment()
  }, [])

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Environment Variables Test</h1>

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
                    {envVars.NILEDB_URL_VALUE && (
                      <p className="text-xs text-gray-500">Value: {envVars.NILEDB_URL_VALUE}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`h-8 w-8 ${process.env.VERCEL ? "bg-green-100" : "bg-red-100"} rounded-full flex items-center justify-center`}
                  >
                    {process.env.VERCEL ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">VERCEL</h3>
                    <p className="text-sm text-gray-600">
                      {process.env.VERCEL ? "Environment variable is set" : "Environment variable is not set"}
                    </p>
                  </div>
                </div>

                {!envVars.NILEDB_URL && (
                  <Alert className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Missing Environment Variable</AlertTitle>
                    <AlertDescription>
                      The NILEDB_URL environment variable is not set. Please add it to your Vercel project settings.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
