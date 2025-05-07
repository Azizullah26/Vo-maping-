import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Use a safer approach to import the database function
    let isConnected = false
    let errorMessage = null

    try {
      // Dynamic import with error handling
      const dbModule = await import("@/lib/db")
      if (typeof dbModule.checkDatabaseConnection === "function") {
        isConnected = await dbModule.checkDatabaseConnection()
      } else {
        errorMessage = "Database check function not found"
      }
    } catch (importError) {
      console.error("Error importing database module:", importError)
      errorMessage = importError instanceof Error ? importError.message : "Unknown import error"
    }

    // Create a safe version of the connection string for display
    const connectionStringPreview = process.env.POSTGRES_URL
      ? `${process.env.POSTGRES_URL.substring(0, 15)}...`
      : "Not set"

    return NextResponse.json({
      success: isConnected,
      message: isConnected ? "Database connection successful" : errorMessage || "Database connection failed",
      connectionString: connectionStringPreview,
    })
  } catch (error) {
    console.error("Database connection error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Database connection check failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
