import { NextResponse } from "next/server"
import { getDbClient } from "@/lib/robust-db-client"

/**
 * Debug endpoint for checking database status with the robust client
 * GET /api/nile/debug
 */
export async function GET() {
  try {
    const dbClient = getDbClient()

    // Get status without connecting
    const initialStatus = dbClient.getStatus()

    // Test connection
    const connectionTest = await dbClient.testConnection()

    // Get updated status
    const updatedStatus = dbClient.getStatus()

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: process.env.VERCEL_ENV || "development",
      initialStatus,
      connectionTest,
      updatedStatus,
      envVars: {
        NILEDB_URL: process.env.NILEDB_URL ? "Configured" : "Not configured",
        NILEDB_API_URL: process.env.NILEDB_API_URL ? "Configured" : "Not configured",
        VERCEL_ENV: process.env.VERCEL_ENV || "Not set",
      },
    })
  } catch (error) {
    console.error("Debug endpoint error:", error)

    return NextResponse.json({
      status: "error",
      message: "An error occurred during debug",
      error: error.message || "Unknown error",
    })
  }
}
