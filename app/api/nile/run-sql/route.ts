import type { NextRequest } from "next/server"
import { safeJsonResponse, withErrorHandling } from "@/lib/api-utils"
import { executeQuery } from "@/lib/db"

/**
 * API route for running SQL commands
 * POST /api/nile/run-sql
 */
export const POST = withErrorHandling(async (req: NextRequest) => {
  try {
    console.log("POST /api/nile/run-sql: Running SQL command")

    // Get the SQL command from the request body
    const body = await req.json()
    const sql = body.sql

    if (!sql) {
      return safeJsonResponse(
        {
          success: false,
          message: "No SQL command provided",
          timestamp: new Date().toISOString(),
        },
        400,
      )
    }

    // Execute the SQL command
    const result = await executeQuery(sql)

    return safeJsonResponse({
      success: true,
      data: {
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
    console.error("Error running SQL command:", error)
    return safeJsonResponse(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error running SQL command",
        timestamp: new Date().toISOString(),
      },
      500,
    )
  }
})
