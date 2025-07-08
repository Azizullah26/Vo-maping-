"use client"

import { useEffect } from "react"

export default function ErrorHandler() {
  useEffect(() => {
    // Global error handler for unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled promise rejection:", event.reason)

      // Send error to logging service in production
      if (process.env.NODE_ENV === "production") {
        try {
          fetch("/api/log-error", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "unhandled_rejection",
              error: event.reason?.toString() || "Unknown error",
              stack: event.reason?.stack,
              timestamp: new Date().toISOString(),
              url: window.location.href,
              userAgent: navigator.userAgent,
            }),
          }).catch((err) => console.error("Failed to log error:", err))
        } catch (err) {
          console.error("Error logging failed:", err)
        }
      }
    }

    // Global error handler for JavaScript errors
    const handleError = (event: ErrorEvent) => {
      console.error("Global error:", event.error)

      if (process.env.NODE_ENV === "production") {
        try {
          fetch("/api/log-error", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "javascript_error",
              message: event.message,
              filename: event.filename,
              lineno: event.lineno,
              colno: event.colno,
              error: event.error?.toString(),
              stack: event.error?.stack,
              timestamp: new Date().toISOString(),
              url: window.location.href,
              userAgent: navigator.userAgent,
            }),
          }).catch((err) => console.error("Failed to log error:", err))
        } catch (err) {
          console.error("Error logging failed:", err)
        }
      }
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
