"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, XCircle, AlertCircle, Database, RefreshCw, Table } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ConnectionResult {
  success: boolean
  message: string
  details?: any
  timestamp: string
  documents?: any[]
}

interface TestResults {
  supabase: ConnectionResult
  direct: ConnectionResult
  timestamp: string
}

export default function SupabaseDirectTestPage() {
  const [results, setResults] = useState<TestResults | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("supabase")

  const testConnection = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/supabase-connection-test/direct")
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error("Error testing connection:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Supabase Connection Test</h1>

      <div className="mb-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Connection Information</AlertTitle>
          <AlertDescription>
            <p>Testing connection to your Supabase database with the following parameters:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>Host: aws-0-us-east-1.pooler.supabase.com</li>
              <li>Port: 6543</li>
              <li>Database: postgres</li>
              <li>User: postgres.pbqfgjzvclwgxgvuzmul</li>
              <li>Pool Mode: transaction</li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Connection Status
          </CardTitle>
          <CardDescription>Testing connection to your Supabase database</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2 text-gray-500">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Testing connection...
            </div>
          ) : results ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="supabase">Supabase Client</TabsTrigger>
                <TabsTrigger value="direct">Direct PostgreSQL</TabsTrigger>
              </TabsList>

              <TabsContent value="supabase">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {results.supabase.success ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className={results.supabase.success ? "text-green-600" : "text-red-600"}>
                      {results.supabase.message}
                    </span>
                  </div>

                  {!results.supabase.success && results.supabase.details && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error Details</AlertTitle>
                      <AlertDescription>
                        <pre className="whitespace-pre-wrap text-xs mt-2">
                          {JSON.stringify(results.supabase.details, null, 2)}
                        </pre>
                      </AlertDescription>
                    </Alert>
                  )}

                  {results.supabase.success && results.supabase.documents && (
                    <div>
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Table className="h-4 w-4" /> Documents Table ({results.supabase.documents.length} records)
                      </h3>
                      {results.supabase.documents.length > 0 ? (
                        <div className="border rounded-md overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                {Object.keys(results.supabase.documents[0]).map((key) => (
                                  <th
                                    key={key}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    {key}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {results.supabase.documents.map((doc, index) => (
                                <tr key={index}>
                                  {Object.values(doc).map((value: any, i) => (
                                    <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {typeof value === "object" ? JSON.stringify(value) : String(value)}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-yellow-600">No documents found in the table.</p>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="direct">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {results.direct.success ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className={results.direct.success ? "text-green-600" : "text-red-600"}>
                      {results.direct.message}
                    </span>
                  </div>

                  {!results.direct.success && results.direct.details && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error Details</AlertTitle>
                      <AlertDescription>
                        <pre className="whitespace-pre-wrap text-xs mt-2">
                          {JSON.stringify(results.direct.details, null, 2)}
                        </pre>
                      </AlertDescription>
                    </Alert>
                  )}

                  {results.direct.success && results.direct.documents && (
                    <div>
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Table className="h-4 w-4" /> Documents Table ({results.direct.documents.length} records)
                      </h3>
                      {results.direct.documents.length > 0 ? (
                        <div className="border rounded-md overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                {Object.keys(results.direct.documents[0]).map((key) => (
                                  <th
                                    key={key}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    {key}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {results.direct.documents.map((doc, index) => (
                                <tr key={index}>
                                  {Object.values(doc).map((value: any, i) => (
                                    <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {typeof value === "object" ? JSON.stringify(value) : String(value)}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-yellow-600">No documents found in the table.</p>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No Results</AlertTitle>
              <AlertDescription>Failed to get connection test results.</AlertDescription>
            </Alert>
          )}
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
          <CardTitle>Troubleshooting</CardTitle>
          <CardDescription>Common issues and solutions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Environment Variables</h3>
              <p className="text-sm text-gray-600 mt-1">
                Make sure these environment variables are correctly set in your .env.local file:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                <li>NEXT_PUBLIC_SUPABASE_URL</li>
                <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
                <li>SUPABASE_POSTGRES_PASSWORD</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium">Connection Issues</h3>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                <li>Check if your IP is allowed in Supabase's network restrictions</li>
                <li>Verify that the "documents" table exists in your database</li>
                <li>Ensure your Supabase project is active and not paused</li>
                <li>Check if your database password is correct</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium">Table Structure</h3>
              <p className="text-sm text-gray-600 mt-1">
                If the connection is successful but no documents are found, you may need to create the table:
              </p>
              <pre className="bg-gray-100 p-3 rounded-md text-xs mt-2 overflow-x-auto">
                {`CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  file_name TEXT,
  type TEXT,
  file_type TEXT,
  size BIGINT,
  file_size BIGINT,
  file_path TEXT,
  file_url TEXT,
  project_id TEXT NOT NULL,
  project_name TEXT,
  document_type TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
