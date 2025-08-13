import { NextResponse } from "next/server"

export async function GET() {
  try {
    const cesiumToken = process.env.CESIUM_ACCESS_TOKEN

    if (!cesiumToken) {
      return NextResponse.json({ error: "Cesium token not configured" }, { status: 500 })
    }

    return NextResponse.json({ token: cesiumToken })
  } catch (error) {
    console.error("Error providing Cesium token:", error)
    return NextResponse.json({ error: "Failed to provide Cesium token" }, { status: 500 })
  }
}
