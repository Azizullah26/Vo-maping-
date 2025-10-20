import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // Get token from server-side environment variable only
    const token = process.env.MAPBOX_ACCESS_TOKEN

    if (!token) {
      return NextResponse.json(
        {
          error: "Mapbox token not configured",
          message: "Please set MAPBOX_ACCESS_TOKEN environment variable",
        },
        { status: 500 },
      )
    }

    return NextResponse.json(
      {
        token,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=3600",
        },
      },
    )
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to retrieve token",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
