"use client"

import React, { type ReactNode } from "react"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback: ReactNode
}

export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  const [hasError, setHasError] = React.useState(false)

  React.useEffect(() => {
    const errorHandler = (error: ErrorEvent) => {
      console.error("Caught error:", error)
      setHasError(true)
    }

    window.addEventListener("error", errorHandler)
    return () => window.removeEventListener("error", errorHandler)
  }, [])

  if (hasError) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

export function AdminFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1b1464]/10 via-[#2a2a72]/10 to-[#000000]/10 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Admin Dashboard Error</h1>
        <p className="mb-4">
          There was an error loading the admin dashboard. This might be due to database connection issues.
        </p>
        <p className="mb-6">The application is running in demo mode with sample data.</p>
        <div className="flex gap-4">
          <a href="/al-ain" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Return to Al Ain Map
          </a>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  )
}
