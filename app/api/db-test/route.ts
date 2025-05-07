import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Import the database function dynamically to avoid build-time issues
    const { checkDatabaseConnection } = await import("@/lib/db")

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
