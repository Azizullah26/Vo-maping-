import type { NextRequest } from "next/server"
import { safeJsonResponse, withErrorHandling } from "@/lib/api-utils"

/**
 * API route for testing direct access to the Nile API
 * GET /api/nile/test-endpoint
 */
export const GET = withErrorHandling(async (req: NextRequest) => {
  try {
    console.log("GET /api/nile/test-endpoint: Testing direct Nile API access")

    // Get environment variables for debugging
    const apiUrl = process.env.NILEDB_API_URL || "https://api.thenile.dev"
    const token = process.env.NILEDB_API_TOKEN || ""
    const databaseId = process.env.NILEDB_DATABASE_ID || "0194e938-6835-709a-88b7-939874e020f7"
    const workspaceId = process.env.NILEDB_WORKSPACE_ID || "0194e937-c587-7a9e-865b-ee1c66fefed3"

    // Construct the URL for the tables endpoint
    const url = `${apiUrl}/v2/databases/${databaseId}/tables`

    console.log(`Making direct request to: ${url}`)

    // Make a direct request to the Nile API
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Direct Nile API error (${response.status}): ${errorText}`)
      return safeJsonResponse(
        {
          success: false,
          message: `Direct Nile API request failed: ${response.status} ${response.statusText}`,
          error: errorText,
          requestDetails: {
            url,
            apiUrl,
            databaseId,
            workspaceId,
            tokenLength: token.length,
          },
        },
        500,
      )
    }

    const data = await response.json()

    return safeJsonResponse({
      success: true,
      message: "Direct Nile API request successful",
      data,
      requestDetails: {
        url,
        apiUrl,
        databaseId,
        workspaceId,
        tokenLength: token.length,
      },
    })
  } catch (error) {
    console.error("Error testing Nile API:", error)
    return safeJsonResponse(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error testing Nile API",
        timestamp: new Date().toISOString(),
      },
      500,
    )
  }
})
