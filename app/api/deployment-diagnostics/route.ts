import { NextResponse } from "next/server"

export async function GET() {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: {
      nodeEnv: process.env.NODE_ENV,
      vercel: process.env.VERCEL,
      vercelEnv: process.env.VERCEL_ENV,
    },
    environmentVariables: {
      supabase: {
        url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        anonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      },
      base: {
        baseUrl: !!process.env.NEXT_PUBLIC_BASE_URL,
        demoMode: process.env.NEXT_PUBLIC_DEMO_MODE,
        staticMode: process.env.NEXT_PUBLIC_STATIC_MODE,
      },
    },
    runtime: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
    },
    paths: {
      cwd: process.cwd(),
    },
  }

  return NextResponse.json({
    status: "ok",
    diagnostics,
  })
}
