"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, XCircle, AlertCircle, RefreshCw, Database, Server, Key } from "lucide-react"
import type { ConnectionTestResult } from "@/lib/supabase-connection-test"

export default function SupabaseConnectionTest() {
  const [clientResult, setClientResult] = useState<ConnectionTestResult | null>(null)
  const [serverResult, setServerResult] = useState<ConnectionTestResult | null>(null)
  const [loading, setLoading] = useState({ client: false, server: false })
  const [envVars, setEnvVars] = useState<Record<string, string | undefined>>({})
  const [showEnvVars, setShowEnvVars] = useState(false)

  // Test client-side connection
  const testClientConnection = async () => {
    setLoading((prev) => ({ ...prev, client: true }))
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      )

      // Check if environment variables are available in the client
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      setEnvVars({
        NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 10)}...` : undefined,
      })

      if (!supabaseUrl || !supabaseAnonKey) {
        setClientResult({
          success: false,
          message: "Missing Supabase environment variables on client",
          timestamp: new Date().toISOString(),
          environment: {
            url: !!supabaseUrl,
            anonKey: !!supabaseAnonKey,
          },
        })
        return
      }

      // Test connection with a simple query
      const { data, error } = await supabase.from("projects").select("count", { count: "exact", head: true })

      if (error) {
        setClientResult({
          success: false,
          message: `Client connection error: ${error.message}`,
          details: { error },
          timestamp: new Date().toISOString(),
          environment: {
            url: true,
            anonKey: true,
          },
        })
        return
      }

      setClientResult({
        success: true,
        message: "Successfully connected to Supabase from client",
        timestamp: new Date().toISOString(),
        environment: {
          url: true,
          anonKey: true,
        },
      })
    } catch (error) {
      setClientResult({
        success: false,
        message: `Unexpected client error: ${error instanceof Error ? error.message : String(error)}`,
        timestamp: new Date().toISOString(),
        environment: {
          url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          anonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        },
      })
    } finally {
      setLoading((prev) => ({ ...prev, client: false }))
    }
  }

  // Test server-side connection
  const testServerConnection = async () => {
    setLoading((prev) => ({ ...prev, server: true }))
    try {
      const response = await fetch("/api/supabase-connection-test")
      const result = await response.json()
      setServerResult(result)
    } catch (error) {
      setServerResult({
        success: false,
        message: `Failed to fetch server test: ${error instanceof Error ? error.message : String(error)}`,
        timestamp: new Date().toISOString(),
        environment: { url: false, anonKey: false },
      })
    } finally {
      setLoading((prev) => ({ ...prev, server: false }))
    }
  }

  // Run tests on component mount
  useEffect(() => {
    testClientConnection()
    testServerConnection()
  }, [])

  const renderStatusIcon = (success: boolean | undefined) => {
    if (success === undefined) return <AlertCircle className="h-5 w-5 text-yellow-500" />
    return success ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />
  }

  const renderStatusAlert = (result: ConnectionTestResult | null, type: "client" | "server") => {
    if (!result) return null

    const title = type === "client" ? "Client Connection" : "Server Connection"

    if (result.success) {
      return (
        <Alert className="bg-green-50 border-green-500 mb-4">
          <CheckCircle2 className="h-5 w-5 text-green-700" />
          <AlertTitle className="text-green-700">{title} Successful</AlertTitle>
          <AlertDescription className="text-green-600">
            {result.message}
            <div className="text-xs mt-1">Timestamp: {new Date(result.timestamp).toLocaleString()}</div>
          </AlertDescription>
        </Alert>
      )
    }

    return (
      <Alert className="bg-red-50 border-red-500 mb-4">
        <XCircle className="h-5 w-5 text-red-700" />
        <AlertTitle className="text-red-700">{title} Failed</AlertTitle>
        <AlertDescription className="text-red-600">
          {result.message}
          <div className="text-xs mt-1">Timestamp: {new Date(result.timestamp).toLocaleString()}</div>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {renderStatusAlert(clientResult, "client")}
      {renderStatusAlert(serverResult, "server")}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" /> Client Connection
            </CardTitle>
            <CardDescription>Tests connection from the browser to Supabase</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Connection Status:</span>
                <span className="flex items-center gap-1">
                  {renderStatusIcon(clientResult?.success)}
                  {clientResult?.success ? "Connected" : "Failed"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>NEXT_PUBLIC_SUPABASE_URL:</span>
                <span className="flex items-center gap-1">
                  {renderStatusIcon(clientResult?.environment.url)}
                  {clientResult?.environment.url ? "Available" : "Missing"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
                <span className="flex items-center gap-1">
                  {renderStatusIcon(clientResult?.environment.anonKey)}
                  {clientResult?.environment.anonKey ? "Available" : "Missing"}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={testClientConnection} disabled={loading.client} className="w-full">
              {loading.client && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
              Test Client Connection
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" /> Server Connection
            </CardTitle>
            <CardDescription>Tests connection from the server to Supabase</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Connection Status:</span>
                <span className="flex items-center gap-1">
                  {renderStatusIcon(serverResult?.success)}
                  {serverResult?.success ? "Connected" : "Failed"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>NEXT_PUBLIC_SUPABASE_URL:</span>
                <span className="flex items-center gap-1">
                  {renderStatusIcon(serverResult?.environment.url)}
                  {serverResult?.environment.url ? "Available" : "Missing"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
                <span className="flex items-center gap-1">
                  {renderStatusIcon(serverResult?.environment.anonKey)}
                  {serverResult?.environment.anonKey ? "Available" : "Missing"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>SUPABASE_SERVICE_ROLE_KEY:</span>
                <span className="flex items-center gap-1">
                  {renderStatusIcon(serverResult?.environment.serviceRole)}
                  {serverResult?.environment.serviceRole === undefined
                    ? "Not Tested"
                    : serverResult?.environment.serviceRole
                      ? "Available"
                      : "Missing or Invalid"}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={testServerConnection} disabled={loading.server} className="w-full">
              {loading.server && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
              Test Server Connection
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" /> Environment Variables
          </CardTitle>
          <CardDescription>Check if environment variables are properly configured</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button variant="outline" onClick={() => setShowEnvVars(!showEnvVars)}>
              {showEnvVars ? "Hide" : "Show"} Environment Variables Status
            </Button>

            {showEnvVars && (
              <div className="border rounded-md p-4 bg-gray-50">
                <h3 className="font-medium mb-2">Client-Side Environment Variables:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>NEXT_PUBLIC_SUPABASE_URL:</span>
                    <span>{envVars.NEXT_PUBLIC_SUPABASE_URL || "Not available"}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
                    <span>{envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY || "Not available"}</span>
                  </li>
                </ul>

                <h3 className="font-medium mt-4 mb-2">Server-Side Environment Variables:</h3>
                <p className="text-sm text-gray-600">
                  Server-side environment variables cannot be displayed in the browser for security reasons. Their
                  availability is checked through the server connection test.
                </p>
              </div>
            )}

            <div className="mt-4">
              <h3 className="font-medium mb-2">Troubleshooting Tips:</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Ensure environment variables are properly set in your .env.local file or deployment platform</li>
                <li>Check that the Supabase project is active and accessible</li>
                <li>Verify that the database tables exist and have the correct permissions</li>
                <li>Make sure your IP is not blocked by any firewall rules</li>
                <li>Check for CORS issues if you're experiencing client-side connection problems</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
