"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

interface TestResult {
  success: boolean
  message: string
  error?: string
  queryResult?: any
}

export default function EdgeDBTestPage() {
  const [result, setResult] = useState<TestResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const runTest = async () => {
    setIsLoading(true)
    setResult(null)
    try {
      const response = await fetch("/api/edgedb-test")
      const data: TestResult = await response.json()
      setResult(data)
    } catch (error: any) {
      setResult({
        success: false,
        message: "Failed to fetch from API route.",
        error: error.message,
      })
    }
    setIsLoading(false)
  }

  useEffect(() => {
    runTest()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>EdgeDB Connection Test</CardTitle>
            <CardDescription>
              This page tests the connection to the EdgeDB instance using the provided credentials.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-start mb-6">
              <Button onClick={runTest} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isLoading ? "Testing..." : "Run Test Again"}
              </Button>
            </div>

            {result && (
              <Alert
                variant={result.success ? "default" : "destructive"}
                className={result.success ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}
              >
                {result.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertTitle>{result.success ? "Success" : "Failure"}</AlertTitle>
                <AlertDescription>
                  {result.message}
                  {result.error && <pre className="mt-2 text-xs bg-gray-100 p-2 rounded">{result.error}</pre>}
                  {result.queryResult !== undefined && (
                    <p className="mt-2 text-sm">Query Result (1 + 1): {JSON.stringify(result.queryResult)}</p>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
