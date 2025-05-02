import { NextResponse } from "next/server"

export async function GET() {
  // Check for environment variables but don't expose actual values
  const envStatus = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_POSTGRES_PASSWORD: !!process.env.SUPABASE_POSTGRES_PASSWORD,
    // Check for the specific variables the user provided
    SUPABASE_POSTGRES_URL: !!process.env.SUPABASE_POSTGRES_URL,
    SUPABASE_POSTGRES_PRISMA_URL: !!process.env.SUPABASE_POSTGRES_PRISMA_URL,
    SUPABASE_SUPABASE_URL: !!process.env.SUPABASE_SUPABASE_URL,
    SUPABASE_NEXT_PUBLIC_SUPABASE_URL: !!process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_POSTGRES_URL_NON_POOLING: !!process.env.SUPABASE_POSTGRES_URL_NON_POOLING,
    SUPABASE_SUPABASE_JWT_SECRET: !!process.env.SUPABASE_SUPABASE_JWT_SECRET,
    SUPABASE_POSTGRES_USER: !!process.env.SUPABASE_POSTGRES_USER,
    SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_POSTGRES_PASSWORD: !!process.env.SUPABASE_POSTGRES_PASSWORD,
    SUPABASE_POSTGRES_DATABASE: !!process.env.SUPABASE_POSTGRES_DATABASE,
    SUPABASE_SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_POSTGRES_HOST: !!process.env.SUPABASE_POSTGRES_HOST,
  }

  // Check if the client-side variables are properly set
  const clientSideVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL === process.env.SUPABASE_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }

  return NextResponse.json({
    envStatus,
    clientSideVars,
    timestamp: new Date().toISOString(),
  })
}
