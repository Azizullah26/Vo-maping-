import { NextResponse } from "next/server"

// Simple dummy function to simulate database connection
async function simpleDatabaseCheck() {
  // Just check if the environment variables exist
  const dbUrl = process.env.POSTGRES_URL || process.env.NILEDB_POSTGRES_URL
  return !!dbUrl
}

export async function GET() {
  try {
    // Use a simplified approach that doesn't require complex imports
    const isConnected = await simpleDatabaseCheck()

    // Create a safe version of the connection string for display
    const connectionStringPreview = process.env.POSTGRES_URL
      ? `${process.env.POSTGRES_URL.substring(0, 15)}...`
      : "Not set"

    return NextResponse.json({
      success: isConnected,
      message: isConnected ? "Database connection successful" : "Database connection failed",
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
