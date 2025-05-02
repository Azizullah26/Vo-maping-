import type { NextRequest } from "next/server"
import { safeJsonResponse, withErrorHandling } from "@/lib/api-utils"

// Handler for POST /api/nile/setup-token
export const POST = withErrorHandling(async (req: NextRequest) => {
  try {
    console.log("POST /api/nile/setup-token: Setting up Nile API token")

    // Get token from request body
    const { token } = await req.json()

    if (!token) {
      return safeJsonResponse(
        {
          success: false,
          message: "Missing token in request body",
        },
        400,
      )
    }

    // In a real application, you would store this token securely
    // For now, we'll just log that we received it
    console.log("Received Nile API token (length):", token.length)

    // Normally, you would set this as an environment variable
    // process.env.NILEDB_API_TOKEN = token;
    // But this won't persist across serverless function invocations

    return safeJsonResponse({
      success: true,
      message: "Nile API token received. Please add it to your environment variables.",
      instructions: "Add NILEDB_API_TOKEN to your Vercel environment variables or .env.local file.",
    })
  } catch (error) {
    console.error("Error setting up Nile API token:", error)
    return safeJsonResponse(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error setting up Nile API token",
      },
      500,
    )
  }
})
