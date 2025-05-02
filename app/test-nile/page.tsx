"use client"

import { useState } from "react"
import { testNileConnection } from "../actions/testConnection"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestNilePage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleTestConnection = async () => {
    try {
      setLoading(true)
      setError(null)
      const connectionResult = await testNileConnection()
      setResult(connectionResult)
      if (!connectionResult.success) {
        setError(connectionResult.error || "Unknown error occurred")
      }
    } catch (err) {
      console.error("Error testing connection:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Nile Database Connection Test</CardTitle>
          <CardDescription>Test your connection to the Nile database</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button onClick={handleTestConnection} disabled={loading} className="w-full">
              {loading ? "Testing Connection..." : "Test Connection"}
            </Button>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
                <h3 className="font-semibold">Connection Error</h3>
                <p>{error}</p>
              </div>
            )}

            {result && !error && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-md text-green-700">
                <h3 className="font-semibold">Connection Successful</h3>
                <p>Connected at: {result.time}</p>
                <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto text-xs">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-gray-500">
            This page tests the connection to your Nile database using both the Nile SDK and direct Postgres connection.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
