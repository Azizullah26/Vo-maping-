"use client"

import { useEffect } from "react"
import { errorCollector } from "@/lib/error-collector"

export default function ErrorHandler() {
  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled promise rejection:", event.reason)
      errorCollector.collectError(
        event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
        "runtime",
        { type: "unhandledRejection" },
      )
    }

    // Handle JavaScript errors
    const handleError = (event: ErrorEvent) => {
      console.error("JavaScript error:", event.error)
      errorCollector.collectError(event.error || new Error(event.message), "runtime", {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      })
    }

    // Add event listeners
    window.addEventListener("unhandledrejection", handleUnhandledRejection)
    window.addEventListener("error", handleError)

    // Cleanup
    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
      window.removeEventListener("error", handleError)
    }
  }, [])

  return null
}
