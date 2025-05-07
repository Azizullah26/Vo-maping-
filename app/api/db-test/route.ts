import "../../../lib/polyfills"
import { NextResponse } from "next/server"
import { checkDatabaseConnection } from "@/lib/db"

export async function GET() {
  try {
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
