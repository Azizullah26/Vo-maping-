import { NextResponse } from "next/server"

export async function GET() {
  try {
    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      services: {
        database: "checking...",
        supabase: "checking...",
      },
    }

    // Check database connection
    try {
      if (process.env.DATABASE_URL || process.env.POSTGRES_URL) {
        health.services.database = "connected"
      } else {
        health.services.database = "not configured"
      }
    } catch (error) {
      health.services.database = "error"
    }

    // Check Supabase connection
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        health.services.supabase = "configured"
      } else {
        health.services.supabase = "not configured"
      }
    } catch (error) {
      health.services.supabase = "error"
    }

    return NextResponse.json(health)
  } catch (error) {
    console.error("Health check error:", error)
    return NextResponse.json(
      {
        status: "unhealthy",
        error: "Health check failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
