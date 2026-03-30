import type { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { safeJsonResponse, withErrorHandling } from "@/lib/api-utils"

/**
 * API route for testing the Nile connection with the provided settings
 * GET /api/nile/test-connection-with-settings
 */
export const GET = withErrorHandling(async (req: NextRequest) => {
  try {
    // Database settings from the user
    const settings = {
      id: "0194e938-6835-709a-88b7-939874e020f7",
      name: "map_project_uae",
      workspace: {
        id: "0194e937-c587-7a9e-865b-ee1c66fefed3",
        name: "vercel_icfg_unFcGCbPaqVzw3IOeVkX2QSO",
        slug: "vercel_icfg_unfcgcbpaqvzw3ioevkx2qso",
      },
      apiHost: "https://us-west-2.api.thenile.dev/v2/databases/0194e938-6835-709a-88b7-939874e020f7",
      dbHost: "postgres://us-west-2.db.thenile.dev:5432/map_project_uae",
    }

    // Test the API connection
    const apiUrl = "https://us-west-2.api.thenile.dev/v2/databases/0194e938-6835-709a-88b7-939874e020f7/tables"
    console.log(`Testing API connection to: ${apiUrl}`)

    const apiResponse = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.NILEDB_API_TOKEN || ""}`,
        "Content-Type": "application/json",
      },
    })

    const apiSuccess = apiResponse.ok
    let apiData = null
    let apiError = null

    try {
      if (apiSuccess) {
        apiData = await apiResponse.json()
      } else {
        apiError = await apiResponse.text()
      }
    } catch (error) {
      apiError = error instanceof Error ? error.message : "Failed to parse API response"
    }

    // Test the database connection via Supabase
    let dbSuccess = false
    let dbError = null

    try {
      const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Supabase environment variables are not configured")
      }

      const supabase = createClient(supabaseUrl, supabaseKey)
      const { error } = await supabase.from("users").select("count").limit(1)

      if (error && error.code !== "PGRST116") {
        // PGRST116 = table not found, still means DB is reachable
        throw new Error(error.message)
      }
      dbSuccess = true
    } catch (error) {
      dbError = error instanceof Error ? error.message : "Unknown database connection error"
    }

    return safeJsonResponse({
      success: true,
      settings,
      api: {
        success: apiSuccess,
        data: apiData,
        error: apiError,
        url: apiUrl,
        token: process.env.NILEDB_API_TOKEN ? `Set (length: ${process.env.NILEDB_API_TOKEN.length})` : "Not set",
      },
      database: {
        success: dbSuccess,
        error: dbError,
        url: process.env.NILEDB_URL || settings.dbHost,
      },
      environment: {
        NILEDB_URL: process.env.NILEDB_URL ? "Set" : "Not set",
        NILEDB_API_URL: process.env.NILEDB_API_URL ? "Set" : "Not set",
        NILEDB_API_TOKEN: process.env.NILEDB_API_TOKEN
          ? `Set (length: ${process.env.NILEDB_API_TOKEN.length})`
          : "Not set",
        NILEDB_DATABASE_ID: process.env.NILEDB_DATABASE_ID ? "Set" : "Not set",
        NILEDB_WORKSPACE_ID: process.env.NILEDB_WORKSPACE_ID ? "Set" : "Not set",
      },
    })
  } catch (error) {
    console.error("Error testing connection with settings:", error)
    return safeJsonResponse(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error testing connection with settings",
      },
      500,
    )
  }
})
