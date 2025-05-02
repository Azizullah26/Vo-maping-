import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Check for required environment variables
    const nileDbUrl = process.env.NILEDB_URL

    return NextResponse.json({
      success: true,
      envVars: {
        NILEDB_URL: !!nileDbUrl,
        // Mask the actual value for security
        NILEDB_URL_VALUE: nileDbUrl ? `${nileDbUrl.substring(0, 8)}...` : null,
      },
    })
  } catch (error) {
    console.error("Error checking environment variables:", error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error checking environment variables",
    })
  }
}
