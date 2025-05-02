import type { NextRequest } from "next/server"
import { safeJsonResponse, withErrorHandling } from "@/lib/api-utils"
import { createClient } from "@supabase/supabase-js"

/**
 * API route for testing the Supabase database connection
 * GET /api/nile/db-connect
 */
export const GET = withErrorHandling(async (req: NextRequest) => {
  try {
    console.log("GET /api/nile/db-connect: Testing Supabase connection")

    // Create Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return safeJsonResponse(
        {
          success: false,
          connection: {
            connected: false,
            message: "Missing Supabase environment variables",
          },
          timestamp: new Date().toISOString(),
        },
        500,
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Test connection with a simple query
    const { data: versionData, error: versionError } = await supabase.rpc("get_db_version")

    if (versionError) {
      return safeJsonResponse(
        {
          success: false,
          connection: {
            connected: false,
            message: versionError.message || "Failed to connect to database",
          },
          timestamp: new Date().toISOString(),
        },
        500,
      )
    }

    // Get current timestamp
    const { data: timeData, error: timeError } = await supabase.rpc("get_current_time")
    const time = timeError ? new Date().toISOString() : timeData

    // Get list of tables
    const { data: tablesData, error: tablesError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .order("table_name")

    const tables = tablesError ? [] : tablesData

    return safeJsonResponse({
      success: true,
      connection: {
        connected: true,
        version: versionData,
        time,
        message: "Supabase connection successful",
      },
      tables,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error connecting to Supabase database:", error)
    return safeJsonResponse(
      {
        success: false,
        connection: {
          connected: false,
          message: error instanceof Error ? error.message : "Unknown error connecting to Supabase database",
        },
        timestamp: new Date().toISOString(),
      },
      500,
    )
  }
})
