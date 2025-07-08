import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Basic health check without exposing sensitive environment variables
    const healthStatus = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      services: {
        database: "checking...",
        storage: "checking...",
      },
    }

    // Check if basic environment variables are configured (without exposing values)
    const requiredEnvVars = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"]

    const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar])

    if (missingEnvVars.length > 0) {
      return NextResponse.json(
        {
          ...healthStatus,
          status: "unhealthy",
          error: "Missing required environment variables",
          missing: missingEnvVars,
        },
        { status: 500 },
      )
    }

    // Update service status
    healthStatus.services.database = "configured"
    healthStatus.services.storage = "configured"

    return NextResponse.json(healthStatus)
  } catch (error) {
    console.error("Health check error:", error)
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
