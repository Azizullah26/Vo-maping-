import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const token = process.env.CESIUM_ACCESS_TOKEN

    if (!token) {
      return NextResponse.json({ error: "Cesium access token not configured" }, { status: 500 })
    }

    return NextResponse.json({ token })
  } catch (error) {
    console.error("Error fetching Cesium token:", error)
    return NextResponse.json({ error: "Failed to fetch Cesium token" }, { status: 500 })
  }
}
