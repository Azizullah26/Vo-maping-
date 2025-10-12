"use client"
import { useState, useEffect } from "react"
import AdminPageClient from "./AdminPageClient"

export default function AdminWrapper() {
  const [error, setError] = useState<Error | null>(null)

  // Add error logging
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("Global error caught:", event.error)
      setError(event.error)
    }

    window.addEventListener("error", handleError)
    return () => window.removeEventListener("error", handleError)
  }, [])

  if (error) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-xl font-bold text-red-700 mb-2">Error Occurred</h2>
        <p className="text-red-600 mb-2">{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Reload Page
        </button>
      </div>
    )
  }

  return <AdminPageClient />
}
