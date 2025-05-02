import { NextResponse } from "next/server"
import { isDatabaseConfigured, initializeDatabase } from "@/lib/db"

export async function GET() {
  try {
    const isConfigured = isDatabaseConfigured()

    return NextResponse.json({
      success: true,
      isConfigured,
      message: isConfigured
        ? "Database is configured"
        : "Database is not configured. Please add POSTGRES_URL or POSTGRES_URL_NON_POOLING environment variable.",
    })
  } catch (error) {
    console.error("Error checking database status:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST() {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Database is not configured. Please add POSTGRES_URL or POSTGRES_URL_NON_POOLING environment variable.",
        },
        { status: 400 },
      )
    }

    const result = await initializeDatabase()

    if (!result.success) {
      if (result.message.includes("WebSocket") || result.message.includes("missing_connection_string")) {
        // Special handling for connection errors
        return NextResponse.json(
          {
            success: false,
            message: result.message,
            demoMode: true,
          },
          { status: 503 },
        )
      }

      return NextResponse.json(result, { status: 500 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error initializing database:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        demoMode: true,
      },
      { status: 500 },
    )
  }
}
