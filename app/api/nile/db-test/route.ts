import type { NextRequest } from "next/server"
import { safeJsonResponse, withErrorHandling } from "@/lib/api-utils"
import { checkDatabaseConnection, executeQuery } from "@/lib/db"

/**
 * API route for testing the database connection
 * GET /api/nile/db-test
 */
export const GET = withErrorHandling(async (req: NextRequest) => {
  try {
    console.log("GET /api/nile/db-test: Testing database connection")

    // Check database connection
    const connectionStatus = await checkDatabaseConnection()

    if (!connectionStatus.connected) {
      return safeJsonResponse(
        {
          success: false,
          message: "Database connection failed",
          error: connectionStatus.error,
          timestamp: new Date().toISOString(),
        },
        500,
      )
    }

    // Try a simple query to list tables
    const tablesResult = await executeQuery(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `)

    return safeJsonResponse({
      success: true,
      connection: connectionStatus,
      tables: tablesResult.rows,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error testing database connection:", error)
    return safeJsonResponse(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error testing database connection",
        timestamp: new Date().toISOString(),
      },
      500,
    )
  }
})

/**
 * API route for initializing the database
 * POST /api/nile/db-test
 */
export const POST = withErrorHandling(async (req: NextRequest) => {
  try {
    console.log("POST /api/nile/db-test: Running test query")

    // Get the query from the request body
    const body = await req.json()
    const query = body.query || "SELECT NOW()"

    // Execute the query
    const result = await executeQuery(query)

    return safeJsonResponse({
      success: true,
      query,
      result: {
        rowCount: result.rowCount,
        rows: result.rows,
        fields: result.fields.map((f) => ({
          name: f.name,
          dataTypeID: f.dataTypeID,
        })),
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error executing test query:", error)
    return safeJsonResponse(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error executing test query",
        timestamp: new Date().toISOString(),
      },
      500,
    )
  }
})
