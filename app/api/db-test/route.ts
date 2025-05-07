import { NextResponse } from "next/server"

// Use a dynamic import to avoid loading the problematic code during build time
export async function GET() {
  try {
    // Only import and use the database module at runtime, not during build
    const { checkDatabaseConnection } = await import("@/lib/db-runtime")

    const isConnected = await checkDatabaseConnection()

    return NextResponse.json({
      success: isConnected,
      message: isConnected ? "Database connection successful" : "Database connection failed",
      connectionString: process.env.POSTGRES_URL ? `${process.env.POSTGRES_URL.substring(0, 15)}...` : "Not set",
    })
  } catch (error) {
    console.error("Database connection error:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown database error",
        error: error instanceof Error ? error.toString() : "Unknown error",
      },
      { status: 500 },
    )
  }
}
