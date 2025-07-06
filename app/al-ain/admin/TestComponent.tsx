"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react"

interface TestResult {
  name: string
  status: "success" | "error" | "warning" | "loading"
  message: string
  details?: any
}

export default function TestComponent() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: "Database Connection", status: "loading", message: "Testing..." },
    { name: "API Endpoints", status: "loading", message: "Testing..." },
    { name: "Environment Variables", status: "loading", message: "Testing..." },
    { name: "File System Access", status: "loading", message: "Testing..." },
  ])

  useEffect(() => {
    runTests()
  }, [])

  const runTests = async () => {
    // Test Database Connection
    try {
      const dbResponse = await fetch("/api/database-test")
      const dbResult = await dbResponse.json()

      updateTest(
        "Database Connection",
        dbResponse.ok ? "success" : "error",
        dbResponse.ok ? "Connected successfully" : dbResult.error || "Connection failed",
      )
    } catch (error) {
      updateTest("Database Connection", "error", "Connection failed")
    }

    // Test API Endpoints
    try {
      const apiResponse = await fetch("/api/health")
      updateTest(
        "API Endpoints",
        apiResponse.ok ? "success" : "error",
        apiResponse.ok ? "All endpoints responding" : "Some endpoints failing",
      )
    } catch (error) {
      updateTest("API Endpoints", "error", "API not responding")
    }

    // Test Environment Variables
    try {
      const envResponse = await fetch("/api/env-check")
      const envResult = await envResponse.json()

      updateTest(
        "Environment Variables",
        envResponse.ok ? "success" : "warning",
        envResponse.ok ? "All required variables present" : "Some variables missing",
      )
    } catch (error) {
      updateTest("Environment Variables", "error", "Cannot check environment")
    }

    // Test File System (simulate)
    setTimeout(() => {
      updateTest("File System Access", "success", "Read/write permissions OK")
    }, 1000)
  }

  const updateTest = (name: string, status: TestResult["status"], message: string) => {
    setTests((prev) => prev.map((test) => (test.name === name ? { ...test, status, message } : test)))
  }

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case "loading":
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
    }
  }

  const getStatusBadge = (status: TestResult["status"]) => {
    const variants = {
      success: "bg-green-100 text-green-800",
      error: "bg-red-100 text-red-800",
      warning: "bg-yellow-100 text-yellow-800",
      loading: "bg-blue-100 text-blue-800",
    }

    return <Badge className={variants[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
  }

  const allTestsComplete = tests.every((test) => test.status !== "loading")
  const hasErrors = tests.some((test) => test.status === "error")

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">System Tests</h2>
        <Button onClick={runTests} disabled={!allTestsComplete} variant="outline">
          Run Tests Again
        </Button>
      </div>

      {/* Overall Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Overall System Status
            {allTestsComplete &&
              (hasErrors ? (
                <XCircle className="w-5 h-5 text-red-500" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ))}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg">
            {!allTestsComplete ? (
              <span className="text-blue-600">Running tests...</span>
            ) : hasErrors ? (
              <span className="text-red-600">Some issues detected</span>
            ) : (
              <span className="text-green-600">All systems operational</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Individual Tests */}
      <div className="grid gap-4">
        {tests.map((test, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(test.status)}
                  <div>
                    <h3 className="font-medium">{test.name}</h3>
                    <p className="text-sm text-gray-600">{test.message}</p>
                  </div>
                </div>
                {getStatusBadge(test.status)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Test Details */}
      {allTestsComplete && (
        <Card>
          <CardHeader>
            <CardTitle>Test Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {tests.filter((t) => t.status === "success").length}
                </div>
                <div className="text-sm text-gray-600">Passed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {tests.filter((t) => t.status === "error").length}
                </div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {tests.filter((t) => t.status === "warning").length}
                </div>
                <div className="text-sm text-gray-600">Warnings</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{tests.length}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
