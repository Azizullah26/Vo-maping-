"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, XCircle, AlertCircle, Database, RefreshCw } from "lucide-react"

export default function SupabaseStatusPage() {
  const [status, setStatus] = useState<{
    connected: boolean
    message: string
    tables: string[]
    projectCount: number
    documentCount: number
    error?: string
  } | null>(null)
  const [loading, setLoading] = useState(true)

  const checkConnection = async () => {
    setLoading(true)
    try {
      const supabase = createClientComponentClient()

      // Test connection with a simple query
      const { data: tablesData, error: tablesError } = await supabase
        .from("information_schema.tables")
        .select("table_name")
        .eq("table_schema", "public")

      if (tablesError) {
        throw tablesError
      }

      const tables = tablesData?.map((t) => t.table_name) || []

      // Count projects
      const { count: projectCount, error: projectError } = await supabase
        .from("projects")
        .select("*", { count: "exact", head: true })

      if (projectError) {
        throw projectError
      }

      // Count documents
      const { count: documentCount, error: documentError } = await supabase
        .from("documents")
        .select("*", { count: "exact", head: true })

      if (documentError) {
        throw documentError
      }

      setStatus({
        connected: true,
        message: "Successfully connected to Supabase",
        tables,
        projectCount: projectCount || 0,
        documentCount: documentCount || 0,
      })
    } catch (error) {
      console.error("Supabase connection error:", error)
      setStatus({
        connected: false,
        message: "Failed to connect to Supabase",
        tables: [],
        projectCount: 0,
        documentCount: 0,
        error: error instanceof Error ? error.message : String(error),
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Supabase Connection Status</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Connection Status
          </CardTitle>
          <CardDescription>Checking connection to Supabase database</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2 text-gray-500">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Testing connection...
            </div>
          ) : status ? (
            <>
              <div className="flex items-center gap-2 mb-4">
                {status.connected ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <span className={status.connected ? "text-green-600" : "text-red-600"}>{status.message}</span>
              </div>

              {status.connected ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Database Tables</h3>
                    {status.tables.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-1">
                        {status.tables.map((table) => (
                          <li key={table}>{table}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-yellow-600">No tables found in the database.</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-md p-4">
                      <p className="text-sm text-gray-500">Projects</p>
                      <p className="text-2xl font-bold">{status.projectCount}</p>
                    </div>
                    <div className="border rounded-md p-4">
                      <p className="text-sm text-gray-500">Documents</p>
                      <p className="text-2xl font-bold">{status.documentCount}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Connection Error</AlertTitle>
                  <AlertDescription>
                    {status.error || "Could not connect to Supabase. Please check your credentials."}
                  </AlertDescription>
                </Alert>
              )}
            </>
          ) : null}
        </CardContent>
        <CardFooter>
          <Button onClick={checkConnection} disabled={loading}>
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
          <CardTitle>Environment Variables</CardTitle>
          <CardDescription>Checking required Supabase environment variables</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {process.env.NEXT_PUBLIC_SUPABASE_URL ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span>NEXT_PUBLIC_SUPABASE_URL</span>
            </div>
            <div className="flex items-center gap-2">
              {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span>NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
