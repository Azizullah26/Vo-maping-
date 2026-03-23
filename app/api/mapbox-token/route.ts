import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET() {
  try {
    const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN

    console.log("[v0] API: Checking MAPBOX_ACCESS_TOKEN environment variable")
    console.log("[v0] API: Token exists:", !!mapboxToken)
    console.log("[v0] API: Token length:", mapboxToken?.length || 0)

    if (!mapboxToken) {
      console.warn("[v0] MAPBOX_ACCESS_TOKEN environment variable is not configured")
      return NextResponse.json(
        {
          error: "Mapbox token not configured. Please add MAPBOX_ACCESS_TOKEN to your environment variables.",
          token: null,
          configured: false,
        },
        { status: 200 }, // Changed from 503 to 200 to prevent deployment errors
      )
    }

    console.log("[v0] API: Token found, returning to client")
    return NextResponse.json(
      {
        token: mapboxToken,
        configured: true,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=3600",
        },
      },
    )
  } catch (error) {
    console.error("Error fetching Mapbox token:", error)
    return NextResponse.json(
      {
        error: "Internal server error while fetching token",
        token: null,
        configured: false,
      },
      { status: 500 },
    )
  }
}
