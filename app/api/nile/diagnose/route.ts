import type { NextRequest } from "next/server"
import { safeJsonResponse, withErrorHandling } from "@/lib/api-utils"
import { nileClient } from "@/lib/nile-client"

/**
 * API route for diagnosing Nile database connection issues
 * GET /api/nile/diagnose
 */
export const GET = withErrorHandling(async (req: NextRequest) => {
  try {
    console.log("GET /api/nile/diagnose: Checking Nile database connection")

    // Check environment variables
    const envVars = {
      NILEDB_URL: process.env.NILEDB_URL ? "Set" : "Not set",
      NILEDB_API_URL: process.env.NILEDB_API_URL ? "Set" : "Not set",
      NILEDB_API_TOKEN: process.env.NILEDB_API_TOKEN
        ? "Set (length: " + process.env.NILEDB_API_TOKEN.length + ")"
        : "Not set",
      NEXT_PUBLIC_NILEDB_URL: process.env.NEXT_PUBLIC_NILEDB_URL ? "Set" : "Not set",
      NILEDB_DATABASE_ID: process.env.NILEDB_DATABASE_ID ? "Set" : "Not set",
      NILEDB_WORKSPACE_ID: process.env.NILEDB_WORKSPACE_ID ? "Set" : "Not set",
    }

    // Check Nile API connection with better error handling
    let healthCheck = { success: false, message: "API check not attempted" }

    try {
      healthCheck = await nileClient.checkHealth()
    } catch (apiError) {
      console.error("Error checking Nile API health:", apiError)
      healthCheck = {
        success: false,
        message: apiError instanceof Error ? apiError.message : "Unknown error checking Nile API health",
      }
    }

    return safeJsonResponse({
      success: true,
      environment: envVars,
      nileApiConnection: healthCheck,
      timestamp: new Date().toISOString(),
      dbStatus: {
        connected: false,
        message: "Using demo mode for stability",
      },
    })
  } catch (error) {
    console.error("Error diagnosing Nile database:", error)
    return safeJsonResponse(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error diagnosing Nile database",
        timestamp: new Date().toISOString(),
        dbStatus: {
          connected: false,
          message: "Error occurred during diagnosis",
        },
      },
      500,
    )
  }
})
