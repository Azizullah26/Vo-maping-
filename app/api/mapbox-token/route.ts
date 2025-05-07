import { NextResponse } from "next/server"

export async function GET() {
  // Use the server-side environment variable (without NEXT_PUBLIC prefix)
  const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN || process.env.MAPBOX_TOKEN

  if (!mapboxToken) {
    return NextResponse.json({ error: "Mapbox token not configured" }, { status: 500 })
  }

  // Return the token with a short expiration time
  return NextResponse.json({ token: mapboxToken })
}
