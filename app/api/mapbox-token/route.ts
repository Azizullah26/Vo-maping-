import { NextResponse } from "next/server"

export async function GET() {
  // For a production environment, it's best practice to store this token in an environment variable.
  const mapboxToken =
    "pk.eyJ1IjoiYXppenVsbGFoMjYxMSIsImEiOiJjbWJzeDkxMDMwa3JhMmtzZHd0Ym9sZm44In0.V2TEaa53IsuNBxLXm4SXSg"

  if (!mapboxToken) {
    return NextResponse.json({ error: "Mapbox token not configured" }, { status: 500 })
  }

  // Return the token
  return NextResponse.json({ token: mapboxToken })
}
