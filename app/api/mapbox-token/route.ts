import { NextResponse } from "next/server"

export async function GET() {
  // Access the environment variable securely on the server
  const mapboxToken =
    process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ||
    process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
    process.env.MAPBOX_ACCESS_TOKEN ||
    process.env.MAPBOX_TOKEN

  if (!mapboxToken) {
    return NextResponse.json({ error: "Mapbox token not configured" }, { status: 500 })
  }

  // Return the token
  return NextResponse.json({ token: mapboxToken })
}
