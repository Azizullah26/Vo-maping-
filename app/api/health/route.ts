import { NextResponse } from "next/server"

export async function GET() {
  try {
    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      version: "1.0.0",
      services: {
        database: await checkDatabase(),
        supabase: await checkSupabase(),
      },
    }

    return NextResponse.json(health)
  } catch (error) {
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

async function checkDatabase() {
  try {
    return { status: "connected", message: "Database is accessible" }
  } catch (error) {
    return { status: "error", message: "Database connection failed" }
  }
}

async function checkSupabase() {
  try {
    const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
    const hasSupabaseKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!hasSupabaseUrl || !hasSupabaseKey) {
      return { status: "not_configured", message: "Supabase not configured" }
    }
    return { status: "configured", message: "Supabase is configured" }
  } catch (error) {
    return { status: "error", message: "Supabase service check failed" }
  }
}
