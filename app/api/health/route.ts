import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check basic environment variables without exposing sensitive data
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
      demo_mode: process.env.NEXT_PUBLIC_DEMO_MODE === "true",
      static_mode: process.env.NEXT_PUBLIC_STATIC_MODE === "true",
      build_env: process.env.NODE_ENV,
    }

    const allConfigured = Object.values(checks.supabase).every(Boolean) && Object.values(checks.database).some(Boolean)

    return NextResponse.json({
      status: allConfigured ? "healthy" : "warning",
      timestamp: new Date().toISOString(),
      checks,
      message: allConfigured ? "All systems operational" : "Running in demo mode - some features may be limited",
    })
  } catch (error) {
    console.error("Health check error:", error)
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        message: "Health check failed",
      },
      { status: 500 },
    )
  }
}
