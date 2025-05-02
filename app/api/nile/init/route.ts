import type { NextRequest } from "next/server"
import { safeJsonResponse, withErrorHandling } from "@/lib/api-utils"
import { checkDatabaseConnection, initializeDatabase } from "@/lib/db"

/**
 * API route for checking database status
 * GET /api/nile/init
 */
export const GET = withErrorHandling(async (req: NextRequest) => {
  try {
    console.log("GET /api/nile/init: Checking database status")

    // Check if database connection is configured
    const isConfigured =
      !!process.env.NILEDB_USER ||
      !!process.env.NILEDB_PASSWORD ||
      !!process.env.NILEDB_HOST ||
      !!process.env.NILEDB_DATABASE

    // If not configured, return early
    if (!isConfigured) {
      return safeJsonResponse({
        isConfigured: false,
        message: "Database connection not configured",
        timestamp: new Date().toISOString(),
      })
    }

    // Check database connection
    const connectionStatus = await checkDatabaseConnection()

    return safeJsonResponse({
      isConfigured: true,
      isConnected: connectionStatus.connected,
      message: connectionStatus.message,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error checking database status:", error)
    return safeJsonResponse(
      {
        isConfigured: false,
        message: error instanceof Error ? error.message : "Unknown error checking database status",
        timestamp: new Date().toISOString(),
      },
      500,
    )
  }
})

/**
 * API route for initializing the database
 * POST /api/nile/init
 */
export const POST = withErrorHandling(async (req: NextRequest) => {
  try {
    console.log("POST /api/nile/init: Initializing database")

    // Check database connection first
    const connectionStatus = await checkDatabaseConnection()

    if (!connectionStatus.connected) {
      return safeJsonResponse(
        {
          success: false,
          message: "Database connection failed. Cannot initialize database.",
          error: connectionStatus.error,
          timestamp: new Date().toISOString(),
        },
        500,
      )
    }

    // Initialize database
    const initResult = await initializeDatabase()

    return safeJsonResponse({
      success: initResult.success,
      message: initResult.message,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error initializing database:", error)
    return safeJsonResponse(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error initializing database",
        timestamp: new Date().toISOString(),
      },
      500,
    )
  }
})
