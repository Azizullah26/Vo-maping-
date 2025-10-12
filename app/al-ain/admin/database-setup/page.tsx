"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { TopNav } from "@/components/TopNav"
import { Database, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DatabaseSetupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [connectionString, setConnectionString] = useState("")
  const [apiUrl, setApiUrl] = useState("https://api.thenile.dev")
  const [apiToken, setApiToken] = useState("")
  const [databaseId, setDatabaseId] = useState("")
  const [workspaceId, setWorkspaceId] = useState("")

  const handleTestConnection = async () => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(false)

      const response = await fetch("/api/nile/test-connection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          connectionString,
          apiUrl,
          apiToken,
          databaseId,
          workspaceId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
      } else {
        setError(data.message || "Connection test failed")
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveConfig = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/nile/save-config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          connectionString,
          apiUrl,
          apiToken,
          databaseId,
          workspaceId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert("Configuration saved successfully!")
        router.push("/al-ain/admin")
      } else {
        setError(data.message || "Failed to save configuration")
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1b1464]/10 via-[#2a2a72]/10 to-[#000000]/10">
      <TopNav />

      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push("/al-ain/admin")}
              className="bg-[#1B1464]/80 hover:bg-[#1B1464] text-white rounded-full w-10 h-10 p-0 shadow-lg transition-all duration-300 hover:scale-105"
              aria-label="Back to Admin"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-[#1b1464] flex items-center gap-2">
                <Database className="h-6 w-6" /> Database Configuration
              </h1>
              <p className="text-gray-600">Set up your Nile database connection</p>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className="bg-white shadow-md">
            <CardHeader>
              <CardTitle>Database Connection Settings</CardTitle>
              <CardDescription>
                Configure your Nile database connection. You can use either direct PostgreSQL connection or the Nile
                API.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-50 border-green-500">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertTitle className="text-green-700">Success</AlertTitle>
                  <AlertDescription className="text-green-600">
                    Connection test successful! You can now save your configuration.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Direct PostgreSQL Connection</h3>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      PostgreSQL Connection String (NILEDB_URL)
                    </label>
                    <Input
                      type="text"
                      value={connectionString}
                      onChange={(e) => setConnectionString(e.target.value)}
                      placeholder="postgres://username:password@host:port/database"
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500">Format: postgres://username:password@host:port/database</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium mb-2">Nile API Connection</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">API URL (NILEDB_API_URL)</label>
                      <Input
                        type="text"
                        value={apiUrl}
                        onChange={(e) => setApiUrl(e.target.value)}
                        placeholder="https://api.thenile.dev"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">API Token (NILEDB_API_TOKEN)</label>
                      <Input
                        type="password"
                        value={apiToken}
                        onChange={(e) => setApiToken(e.target.value)}
                        placeholder="Your Nile API token"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Database ID (NILEDB_DATABASE_ID)
                      </label>
                      <Input
                        type="text"
                        value={databaseId}
                        onChange={(e) => setDatabaseId(e.target.value)}
                        placeholder="0194e938-6835-709a-88b7-939874e020f7"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Workspace ID (NILEDB_WORKSPACE_ID)
                      </label>
                      <Input
                        type="text"
                        value={workspaceId}
                        onChange={(e) => setWorkspaceId(e.target.value)}
                        placeholder="0194e937-c587-7a9e-865b-ee1c66fefed3"
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.push("/al-ain/admin")}>
                Cancel
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleTestConnection}
                  disabled={loading}
                  className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                >
                  Test Connection
                </Button>
                <Button
                  onClick={handleSaveConfig}
                  disabled={loading || (!connectionString && (!apiToken || !databaseId || !workspaceId))}
                  className="bg-[#1B1464] hover:bg-[#1B1464]/90"
                >
                  Save Configuration
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
