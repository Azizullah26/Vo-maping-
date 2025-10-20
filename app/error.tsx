"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <CardTitle className="text-red-600">Something went wrong</CardTitle>
          <CardDescription>An error occurred while loading the application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm font-mono text-red-800">{error.message}</p>
            {error.digest && <p className="text-xs text-red-600 mt-2">Error ID: {error.digest}</p>}
          </div>

          <div className="flex gap-2">
            <Button onClick={reset} className="flex-1">
              Try again
            </Button>
            <Button onClick={() => (window.location.href = "/")} variant="outline" className="flex-1">
              Go home
            </Button>
          </div>

          <details className="text-xs text-gray-600">
            <summary className="cursor-pointer font-medium mb-2">Technical details</summary>
            <pre className="bg-gray-100 p-2 rounded overflow-auto">{error.stack}</pre>
          </details>
        </CardContent>
      </Card>
    </div>
  )
}
