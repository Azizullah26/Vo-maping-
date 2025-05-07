import type { NextRequest } from "next/server"
import { safeJsonResponse } from "@/lib/api-utils"

export async function POST(req: NextRequest) {
  try {
    const { connectionString, apiUrl, apiToken, databaseId, workspaceId } = await req.json()

    // Test results
    const results = {
      directConnection: {
        success: false,
        message: "Direct database connections are disabled in serverless environments",
      },
      apiConnection: { success: false, message: "Not tested" },
    }

    // Test Nile API connection if provided
    if (apiUrl && apiToken && databaseId) {
      try {
        const url = `${apiUrl}/v2/databases/${databaseId}/tables`
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${apiToken}`,
            "Content-Type": "application/json",
          },
        })

        if (response.ok) {
          results.apiConnection = { success: true, message: "API connection successful" }
        } else {
          const errorText = await response.text()
          results.apiConnection = {
            success: false,
            message: `API error (${response.status}): ${errorText}`,
          }
        }
      } catch (error) {
        results.apiConnection = {
          success: false,
          message: error instanceof Error ? error.message : "Unknown error",
        }
      }
    }

    // Overall success if at least one connection method works
    const success = results.apiConnection.success

    return safeJsonResponse({
      success,
      results,
      message: success ? "API connection is working" : "All connection methods failed",
    })
  } catch (error) {
    console.error("Error testing connection:", error)
    return safeJsonResponse(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    )
  }
}
