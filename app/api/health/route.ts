import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET() {
  try {
    const checks = {
      supabase: {
        url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        anon_key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        service_role: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      },
      database: {
        url: !!process.env.DATABASE_URL,
        postgres: !!process.env.POSTGRES_URL,
      },
      mapbox: {
        token: !!process.env.MAPBOX_ACCESS_TOKEN,
      },
      demo_mode: process.env.NEXT_PUBLIC_DEMO_MODE === "true",
      static_mode: process.env.NEXT_PUBLIC_STATIC_MODE === "true",
      build_env: process.env.NODE_ENV,
    }

    const allConfigured = Object.values(checks.supabase).some(Boolean) && Object.values(checks.database).some(Boolean)

    return NextResponse.json(
      {
        status: allConfigured ? "healthy" : "warning",
        timestamp: new Date().toISOString(),
        checks,
        message: allConfigured ? "All systems operational" : "Running in demo mode - some features may be limited",
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    )
  } catch (error) {
    console.error("Health check error:", error)
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        message: "Health check failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
