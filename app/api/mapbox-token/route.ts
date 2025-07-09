import { NextResponse } from "next/server"

// Server-side route to provide Mapbox token securely
export async function GET() {
  try {
    // Use the provided Mapbox token
    const mapboxToken =
      "pk.eyJ1IjoiYXppenVsbGFoMjYxMSIsImEiOiJjbWJzeDkxMDMwa3JhMmtzZHd0Ym9sZm44In0.V2TEaa53IsuNBxLXm4SXSg"

    if (!mapboxToken) {
      return NextResponse.json({ error: "Mapbox token not configured" }, { status: 500 })
    }

    return NextResponse.json({ token: mapboxToken })
  } catch (error) {
    console.error("Error providing Mapbox token:", error)
    return NextResponse.json({ error: "Failed to provide Mapbox token" }, { status: 500 })
  }
}
