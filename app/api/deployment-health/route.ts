import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET() {
  try {
    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        isVercel: process.env.VERCEL === "1",
        vercelEnv: process.env.VERCEL_ENV,
      },
      checks: {
        supabase: {
          configured: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
        },
        mapbox: {
          configured: !!process.env.MAPBOX_ACCESS_TOKEN,
        },
        database: {
          configured: !!(process.env.DATABASE_URL || process.env.POSTGRES_URL),
        },
      },
    }

    const allHealthy = Object.values(health.checks).every((check) => check.configured)

    return NextResponse.json(
      {
        ...health,
        status: allHealthy ? "healthy" : "degraded",
      },
      { status: allHealthy ? 200 : 503 },
    )
  } catch (error) {
    console.error("Health check error:", error)
    return NextResponse.json(
      {
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
