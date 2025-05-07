import { NextResponse } from "next/server"

export async function GET() {
  const healthStatus = {
    api: {
      status: "healthy",
      timestamp: new Date().toISOString(),
    },
    environment: {
      VERCEL_ENV: process.env.VERCEL_ENV || "not set",
      NODE_ENV: process.env.NODE_ENV || "not set",
      hasNileDbUrl: !!process.env.NILEDB_POSTGRES_URL,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
  }

  return NextResponse.json(healthStatus)
}
