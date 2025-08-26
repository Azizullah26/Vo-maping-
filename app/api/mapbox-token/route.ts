import { NextResponse } from "next/server"

export async function GET() {
  try {
    const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN

    if (!mapboxToken) {
      return NextResponse.json({
        error: "Mapbox token not configured",
        message: "Please set MAPBOX_ACCESS_TOKEN environment variable"
      }, { status: 500 })
    }

    // Validate token format
    if (!mapboxToken.startsWith('pk.')) {
      return NextResponse.json({
        error: "Invalid token format",
        message: "Mapbox public tokens must start with 'pk.'"
      }, { status: 500 })
    }

    // Optionally validate token with Mapbox API (commented out to avoid rate limits)
    // const validation = await fetch(`https://api.mapbox.com/tokens/v2?access_token=${mapboxToken}`)
    // if (!validation.ok) {
    //   return NextResponse.json({
    //     error: "Invalid Mapbox token",
    //     message: "Token failed validation with Mapbox API"
    //   }, { status: 500 })
    // }

    return NextResponse.json({ token: mapboxToken })
  } catch (error) {
    console.error("Error providing Mapbox token:", error)
    return NextResponse.json({ error: "Failed to provide Mapbox token" }, { status: 500 })
  }
}
