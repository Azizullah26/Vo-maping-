import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Basic health check that doesn't depend on any external services
    const health = {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
    }

    return NextResponse.json(health, { status: 200 })
  } catch (error) {
    console.error("Health check failed:", error)
    return NextResponse.json({ status: "error", message: "Health check failed", error: String(error) }, { status: 500 })
  }
}
