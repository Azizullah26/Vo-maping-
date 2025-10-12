import { NextResponse } from "next/server"
import { initializeDatabase, isDatabaseConfigured } from "@/lib/db"

export async function POST() {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json(
        {
          success: false,
          message: "Database is not configured. Please add POSTGRES_URL to your environment variables.",
        },
        { status: 400 },
      )
    }

    const result = await initializeDatabase()

    if (!result.success && result.message.includes("WebSocket")) {
      // Special handling for WebSocket errors
      return NextResponse.json(
        {
          success: false,
          message:
            "Database connection failed. This may be due to network restrictions in the serverless environment. The application will operate in demo mode.",
          demoMode: true,
        },
        { status: 503 },
      )
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
