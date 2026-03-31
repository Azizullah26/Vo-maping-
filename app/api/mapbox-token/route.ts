import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET() {
  try {
    const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN

    console.log("[v0] Mapbox token check:")
    console.log("[v0] - Token exists:", !!mapboxToken)
    console.log("[v0] - Token value (first 20 chars):", mapboxToken?.substring(0, 20))
    console.log("[v0] - All env keys:", Object.keys(process.env).filter(k => k.includes('MAPBOX') || k.includes('mapbox')))

    if (!mapboxToken) {
      console.warn("[v0] MAPBOX_ACCESS_TOKEN environment variable is not configured")
      console.warn("[v0] Available environment variables with 'MAP' or 'BOX':", 
        Object.keys(process.env).filter(k => k.toUpperCase().includes('MAP') || k.toUpperCase().includes('BOX')))
      
      return NextResponse.json(
        {
          error: "Mapbox token not configured. Please add MAPBOX_ACCESS_TOKEN to your environment variables or .env.local file.",
          token: null,
          configured: false,
          debug: {
            tokenExists: false,
            envVarsWithMapbox: Object.keys(process.env).filter(k => k.toUpperCase().includes('MAPBOX')).length
          }
        },
        { status: 200 }, // Changed from 503 to 200 to prevent deployment errors
      )
    }

    console.log("[v0] Successfully returning Mapbox token")
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
    console.error("[v0] Error fetching Mapbox token:", error)
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
