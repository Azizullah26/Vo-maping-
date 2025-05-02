import type { NextRequest } from "next/server"
import { safeJsonResponse } from "@/lib/api-utils"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {
  try {
    const { connectionString, apiUrl, apiToken, databaseId, workspaceId } = await req.json()

    // Store the configuration in cookies (for demo purposes)
    // In a real application, you would store this in a more secure way
    const cookieStore = cookies()

    if (connectionString) {
      cookieStore.set("nile_connection_string", connectionString, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      })
    }

    if (apiUrl) {
      cookieStore.set("nile_api_url", apiUrl, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      })
    }

    if (apiToken) {
      cookieStore.set("nile_api_token", apiToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      })
    }

    if (databaseId) {
      cookieStore.set("nile_database_id", databaseId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      })
    }

    if (workspaceId) {
      cookieStore.set("nile_workspace_id", workspaceId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      })
    }

    return safeJsonResponse({
      success: true,
      message: "Configuration saved successfully",
    })
  } catch (error) {
    console.error("Error saving configuration:", error)
    return safeJsonResponse(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    )
  }
}
