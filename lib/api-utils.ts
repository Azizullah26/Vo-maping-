import { NextResponse } from "next/server"

/**
 * Helper function to ensure we always return valid JSON responses
 * This prevents 500 errors due to JSON serialization issues
 */
export function safeJsonResponse(data: any, status = 200) {
  try {
    return new NextResponse(JSON.stringify(data), {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error creating JSON response:", error)
    // Fallback to a simple response if JSON stringification fails
    return new NextResponse(
      JSON.stringify({
        error: "Failed to create response",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}

/**
 * Wraps an API handler function with error handling
 * This ensures that any unhandled errors are caught and returned as proper JSON responses
 */
export function withErrorHandling(handler: Function) {
  return async (...args: any[]) => {
    try {
      return await handler(...args)
    } catch (error) {
      console.error("Unhandled API error:", error)
      return safeJsonResponse(
        {
          success: false,
          error: "Internal server error",
          message: error instanceof Error ? error.message : "Unknown error",
          stack: process.env.NODE_ENV !== "production" && error instanceof Error ? error.stack : undefined,
        },
        500,
      )
    }
  }
}
