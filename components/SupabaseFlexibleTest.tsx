"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, XCircle, AlertCircle, RefreshCw, Database, Key } from "lucide-react"
import { testSupabaseConnection } from "@/lib/supabase-flexible-client"
import { checkRequiredEnvVars } from "@/lib/env-utils"

export default function SupabaseFlexibleTest() {
  const [connectionStatus, setConnectionStatus] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [envStatus, setEnvStatus] = useState<ReturnType<typeof checkRequiredEnvVars> | null>(null)

  const testConnection = async () => {
    setLoading(true)
    try {
      // Check environment variables
      const envCheck = checkRequiredEnvVars()
      setEnvStatus(envCheck)

      if (!envCheck.isValid) {
        setConnectionStatus({
          success: false,
          message: `Missing required environment variables: ${envCheck.missing.join(", ")}`,
        })
        return
      }

      // Test connection
      const result = await testSupabaseConnection()
      setConnectionStatus(result)
    } catch (error) {
      setConnectionStatus({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : String(error)}`,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" /> Supabase Connection Test
          </CardTitle>
          <CardDescription>Testing connection with flexible environment variables</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Environment Variables Status */}
            <div className="border rounded-md p-4 bg-gray-50">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Key className="h-4 w-4" /> Environment Variables
              </h3>
              {envStatus ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {envStatus.isValid ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span>
                      {envStatus.isValid
                        ? "All required environment variables are set"
                        : `Missing: ${envStatus.missing.join(", ")}`}
                    </span>
                  </div>

                  <div className="text-sm space-y-1">
                    <div className="flex items-center justify-between">
                      <span>SUPABASE_URL:</span>
                      <span className={envStatus.values.SUPABASE_URL ? "text-green-600" : "text-red-600"}>
                        {envStatus.values.SUPABASE_URL ? "✓ Set" : "✗ Missing"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>SUPABASE_ANON_KEY:</span>
                      <span className={envStatus.values.SUPABASE_ANON_KEY ? "text-green-600" : "text-red-600"}>
                        {envStatus.values.SUPABASE_ANON_KEY ? "✓ Set" : "✗ Missing"}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-500">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Checking environment variables...
                </div>
              )}
            </div>

            {/* Connection Status */}
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Connection Status</h3>
              {loading ? (
                <div className="flex items-center gap-2 text-gray-500">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Testing connection...
                </div>
              ) : connectionStatus ? (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {connectionStatus.success ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className={connectionStatus.success ? "text-green-600" : "text-red-600"}>
                      {connectionStatus.message}
                    </span>
                  </div>

                  {!connectionStatus.success && connectionStatus.error && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error Details</AlertTitle>
                      <AlertDescription>
                        <pre className="whitespace-pre-wrap text-xs mt-2">
                          {JSON.stringify(connectionStatus.error, null, 2)}
                        </pre>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ) : (
                <span className="text-gray-500">No connection test results yet</span>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={testConnection} disabled={loading}>
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Test Connection
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Environment Variable Guide</CardTitle>
          <CardDescription>How to set up your environment variables correctly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Next.js Environment Variables</h3>
              <p className="text-sm text-gray-600 mt-1">
                For Next.js applications, use the NEXT_PUBLIC_ prefix for client-side variables:
              </p>
              <pre className="bg-gray-100 p-3 rounded-md text-xs mt-2">
                {`# .env.local file
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here`}
              </pre>
            </div>

            <div>
              <h3 className="font-medium">React Environment Variables</h3>
              <p className="text-sm text-gray-600 mt-1">For React applications, use the REACT_APP_ prefix:</p>
              <pre className="bg-gray-100 p-3 rounded-md text-xs mt-2">
                {`# .env file
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here`}
              </pre>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Important Note</AlertTitle>
              <AlertDescription>
                This component supports both naming conventions, but for Next.js applications, it's recommended to use
                the NEXT_PUBLIC_ prefix for better compatibility.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
