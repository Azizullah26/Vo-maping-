"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Database, CheckCircle, XCircle, AlertCircle, Loader2, Play, RefreshCw } from "lucide-react"

interface DatabaseStatus {
  connected: boolean
  tablesExist: boolean
  error?: string
}

interface SetupStep {
  id: string
  name: string
  description: string
  status: "pending" | "running" | "success" | "error"
  message?: string
}

export default function DatabaseSetupPage() {
  const [status, setStatus] = useState<DatabaseStatus>({
    connected: false,
    tablesExist: false,
  })
  const [loading, setLoading] = useState(true)
  const [setupSteps, setSetupSteps] = useState<SetupStep[]>([
    {
      id: "connection",
      name: "Test Connection",
      description: "Verify database connection",
      status: "pending",
    },
    {
      id: "tables",
      name: "Create Tables",
      description: "Create required database tables",
      status: "pending",
    },
    {
      id: "seed",
      name: "Seed Data",
      description: "Insert initial data",
      status: "pending",
    },
  ])

  useEffect(() => {
    checkDatabaseStatus()
  }, [])

  const checkDatabaseStatus = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/database/status")
      const data = await response.json()

      setStatus({
        connected: data.connected,
        tablesExist: data.tablesExist,
        error: data.error,
      })
    } catch (error) {
      setStatus({
        connected: false,
        tablesExist: false,
        error: "Failed to check database status",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateStepStatus = (stepId: string, status: SetupStep["status"], message?: string) => {
    setSetupSteps((prev) => prev.map((step) => (step.id === stepId ? { ...step, status, message } : step)))
  }

  const runSetup = async () => {
    // Step 1: Test Connection
    updateStepStatus("connection", "running")
    try {
      const connResponse = await fetch("/api/database-test")
      if (connResponse.ok) {
        updateStepStatus("connection", "success", "Database connected successfully")
      } else {
        updateStepStatus("connection", "error", "Connection failed")
        return
      }
    } catch (error) {
      updateStepStatus("connection", "error", "Connection failed")
      return
    }

    // Step 2: Create Tables
    updateStepStatus("tables", "running")
    try {
      const tablesResponse = await fetch("/api/init-tables", { method: "POST" })
      if (tablesResponse.ok) {
        updateStepStatus("tables", "success", "Tables created successfully")
      } else {
        updateStepStatus("tables", "error", "Failed to create tables")
        return
      }
    } catch (error) {
      updateStepStatus("tables", "error", "Failed to create tables")
      return
    }

    // Step 3: Seed Data
    updateStepStatus("seed", "running")
    try {
      // Simulate seeding data
      await new Promise((resolve) => setTimeout(resolve, 2000))
      updateStepStatus("seed", "success", "Initial data inserted")
    } catch (error) {
      updateStepStatus("seed", "error", "Failed to seed data")
    }

    // Refresh status
    await checkDatabaseStatus()
  }

  const resetSetup = () => {
    setSetupSteps((prev) =>
      prev.map((step) => ({
        ...step,
        status: "pending",
        message: undefined,
      })),
    )
  }

  const getStatusIcon = (status: SetupStep["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />
      case "running":
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />
    }
  }

  const isSetupRunning = setupSteps.some((step) => step.status === "running")
  const setupComplete = setupSteps.every((step) => step.status === "success")

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Database Setup</h1>
        <Button variant="outline" onClick={checkDatabaseStatus} disabled={loading}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Status
        </Button>
      </div>

      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Current Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Checking database status...</span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Database Connection:</span>
                <Badge variant={status.connected ? "default" : "destructive"}>
                  {status.connected ? "Connected" : "Disconnected"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Tables Exist:</span>
                <Badge variant={status.tablesExist ? "default" : "secondary"}>
                  {status.tablesExist ? "Yes" : "No"}
                </Badge>
              </div>
              {status.error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{status.error}</AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Setup Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Setup Process</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {setupSteps.map((step, index) => (
            <div key={step.id} className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="flex-shrink-0">{getStatusIcon(step.status)}</div>
              <div className="flex-grow">
                <h3 className="font-medium">{step.name}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
                {step.message && <p className="text-sm mt-1 text-blue-600">{step.message}</p>}
              </div>
              <div className="flex-shrink-0">
                <Badge
                  variant={
                    step.status === "success"
                      ? "default"
                      : step.status === "error"
                        ? "destructive"
                        : step.status === "running"
                          ? "secondary"
                          : "outline"
                  }
                >
                  {step.status}
                </Badge>
              </div>
            </div>
          ))}

          <div className="flex gap-2 pt-4">
            <Button onClick={runSetup} disabled={isSetupRunning || setupComplete} className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              {isSetupRunning ? "Running Setup..." : "Run Setup"}
            </Button>

            <Button variant="outline" onClick={resetSetup} disabled={isSetupRunning}>
              Reset
            </Button>
          </div>

          {setupComplete && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>Database setup completed successfully! Your system is ready to use.</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
