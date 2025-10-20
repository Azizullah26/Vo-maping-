import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET() {
  try {
    const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN

    if (!mapboxToken) {
      return NextResponse.json(
        {
          error: "Mapbox token not configured",
          token: null,
        },
        { status: 503 },
      )
    }

    return NextResponse.json(
      {
        token: mapboxToken,
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
        error: "Internal server error",
        token: null,
      },
      { status: 500 },
    )
  }
}
