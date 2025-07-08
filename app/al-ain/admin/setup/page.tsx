"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle } from "lucide-react"

interface ConfigState {
  supabaseUrl: string
  supabaseAnonKey: string
  supabaseServiceKey: string
  mapboxToken: string
  nileUrl: string
  nileApiToken: string
}

interface TestResult {
  success: boolean
  message: string
  details?: any
}

export default function SetupPage() {
  const [config, setConfig] = useState<ConfigState>({
    supabaseUrl: "",
    supabaseAnonKey: "",
    supabaseServiceKey: "",
    mapboxToken: "",
    nileUrl: "",
    nileApiToken: "",
  })

  const [testResults, setTestResults] = useState<Record<string, TestResult>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (key: keyof ConfigState, value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  const testSupabaseConnection = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/supabase-connection-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: config.supabaseUrl,
          anonKey: config.supabaseAnonKey,
          serviceKey: config.supabaseServiceKey,
        }),
      })

      const result = await response.json()
      setTestResults((prev) => ({ ...prev, supabase: result }))
    } catch (error) {
      setTestResults((prev) => ({
        ...prev,
        supabase: {
          success: false,
          message: "Connection test failed",
          details: error,
        },
      }))
    }
    setIsLoading(false)
  }

  const testNileConnection = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/nile/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: config.nileUrl,
          apiToken: config.nileApiToken,
        }),
      })

      const result = await response.json()
      setTestResults((prev) => ({ ...prev, nile: result }))
    } catch (error) {
      setTestResults((prev) => ({
        ...prev,
        nile: {
          success: false,
          message: "Connection test failed",
          details: error,
        },
      }))
    }
    setIsLoading(false)
  }

  const testMapboxToken = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/test.json?access_token=${config.mapboxToken}`,
      )
      const result = response.ok

      setTestResults((prev) => ({
        ...prev,
        mapbox: {
          success: result,
          message: result ? "Mapbox token is valid" : "Invalid Mapbox token",
        },
      }))
    } catch (error) {
      setTestResults((prev) => ({
        ...prev,
        mapbox: {
          success: false,
          message: "Mapbox token test failed",
          details: error,
        },
      }))
    }
    setIsLoading(false)
  }

  const saveConfiguration = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/nile/save-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      })

      if (response.ok) {
        alert("Configuration saved successfully!")
      } else {
        alert("Failed to save configuration")
      }
    } catch (error) {
      alert("Error saving configuration")
    }
    setIsLoading(false)
  }

  const renderTestResult = (key: string) => {
    const result = testResults[key]
    if (!result) return null

    return (
      <Alert className={`mt-2 ${result.success ? "border-green-500" : "border-red-500"}`}>
        <div className="flex items-center gap-2">
          {result.success ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <XCircle className="h-4 w-4 text-red-500" />
          )}
          <AlertDescription>{result.message}</AlertDescription>
        </div>
      </Alert>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-2xl">System Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="supabase" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-700">
                <TabsTrigger value="supabase" className="text-white">
                  Supabase
                </TabsTrigger>
                <TabsTrigger value="mapbox" className="text-white">
                  Mapbox
                </TabsTrigger>
                <TabsTrigger value="nile" className="text-white">
                  Nile
                </TabsTrigger>
              </TabsList>

              <TabsContent value="supabase" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="supabaseUrl" className="text-white">
                      Supabase URL
                    </Label>
                    <Input
                      id="supabaseUrl"
                      type="url"
                      placeholder="https://your-project.supabase.co"
                      value={config.supabaseUrl}
                      onChange={(e) => handleInputChange("supabaseUrl", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="supabaseAnonKey" className="text-white">
                      Supabase Anon Key
                    </Label>
                    <Input
                      id="supabaseAnonKey"
                      type="password"
                      placeholder="Enter your Supabase anon key"
                      value={config.supabaseAnonKey}
                      onChange={(e) => handleInputChange("supabaseAnonKey", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="supabaseServiceKey" className="text-white">
                      Supabase Service Key
                    </Label>
                    <Input
                      id="supabaseServiceKey"
                      type="password"
                      placeholder="Enter your Supabase service key"
                      value={config.supabaseServiceKey}
                      onChange={(e) => handleInputChange("supabaseServiceKey", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <Button
                    onClick={testSupabaseConnection}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Test Supabase Connection
                  </Button>

                  {renderTestResult("supabase")}
                </div>
              </TabsContent>

              <TabsContent value="mapbox" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="mapboxToken" className="text-white">
                      Mapbox Access Token
                    </Label>
                    <Input
                      id="mapboxToken"
                      type="password"
                      placeholder="Enter your Mapbox access token"
                      value={config.mapboxToken}
                      onChange={(e) => handleInputChange("mapboxToken", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <Button onClick={testMapboxToken} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                    Test Mapbox Token
                  </Button>

                  {renderTestResult("mapbox")}
                </div>
              </TabsContent>

              <TabsContent value="nile" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="nileUrl" className="text-white">
                      Nile Database URL
                    </Label>
                    <Input
                      id="nileUrl"
                      type="url"
                      placeholder="Enter your Nile database URL"
                      value={config.nileUrl}
                      onChange={(e) => handleInputChange("nileUrl", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="nileApiToken" className="text-white">
                      Nile API Token
                    </Label>
                    <Input
                      id="nileApiToken"
                      type="password"
                      placeholder="Enter your Nile API token"
                      value={config.nileApiToken}
                      onChange={(e) => handleInputChange("nileApiToken", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <Button onClick={testNileConnection} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                    Test Nile Connection
                  </Button>

                  {renderTestResult("nile")}
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 pt-6 border-t border-gray-600">
              <Button
                onClick={saveConfiguration}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Save Configuration
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
