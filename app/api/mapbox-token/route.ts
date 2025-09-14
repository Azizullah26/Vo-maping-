import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const token = process.env.MAPBOX_ACCESS_TOKEN

    if (!token) {
      return NextResponse.json({ error: "Mapbox access token not configured" }, { status: 500 })
    }

    return NextResponse.json({ token })
  } catch (error) {
    console.error("Error fetching Mapbox token:", error)
    return NextResponse.json({ error: "Failed to fetch Mapbox token" }, { status: 500 })
  }
}
