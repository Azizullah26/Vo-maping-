import type { NextRequest } from "next/server"
import { safeJsonResponse, withErrorHandling } from "@/lib/api-utils"
import { nileClient } from "@/lib/nile-client"

// Handler for GET /api/nile/test-token
export const GET = withErrorHandling(async (req: NextRequest) => {
  try {
    console.log("GET /api/nile/test-token: Testing Nile API token")

    // Check if token is set
    const tokenSet = !!process.env.NILEDB_API_TOKEN

    if (!tokenSet) {
      return safeJsonResponse(
        {
          success: false,
          message: "NILEDB_API_TOKEN is not set",
        },
        400,
      )
    }

    // Test the token by making a request to the Nile API
    const healthCheck = await nileClient.checkHealth()

    return safeJsonResponse({
      success: healthCheck.success,
      message: healthCheck.message,
      tokenStatus: tokenSet ? "Set" : "Not set",
      tokenLength: tokenSet ? process.env.NILEDB_API_TOKEN!.length : 0,
    })
  } catch (error) {
    console.error("Error testing Nile API token:", error)
    return safeJsonResponse(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error testing Nile API token",
      },
      500,
    )
  }
})
