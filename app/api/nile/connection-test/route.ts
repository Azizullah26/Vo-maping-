import { NextResponse } from "next/server"
import { getDbClient } from "@/lib/robust-db-client"

/**
 * API route for testing database connection using the robust client
 * GET /api/nile/connection-test
 */
export async function GET() {
  try {
    const dbClient = getDbClient()
    const connectionTest = await dbClient.testConnection()

    return NextResponse.json({
      ...connectionTest,
      timestamp: new Date().toISOString(),
      environment: process.env.VERCEL_ENV || "development",
    })
  } catch (error) {
    console.error("Connection test endpoint error:", error)

    // Always return a valid JSON response
    return NextResponse.json({
      success: false,
      message: "An error occurred during connection test",
      error: error.message || "Unknown error",
      timestamp: new Date().toISOString(),
    })
  }
}
