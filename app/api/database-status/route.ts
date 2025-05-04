import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Return a simple status response without trying to connect to any database
    return NextResponse.json({
      success: true,
      status: "Service is running",
      databaseStatus: "Database connection check skipped during build",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in database status check:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error checking database status",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
