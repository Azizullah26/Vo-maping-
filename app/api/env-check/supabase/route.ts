import { NextResponse } from "next/server"

export async function GET() {
  // Check for required environment variables
  const envVars = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_POSTGRES_URL: !!process.env.SUPABASE_POSTGRES_URL,
    SUPABASE_POSTGRES_PRISMA_URL: !!process.env.SUPABASE_POSTGRES_PRISMA_URL,
    SUPABASE_POSTGRES_URL_NON_POOLING: !!process.env.SUPABASE_POSTGRES_URL_NON_POOLING,
    SUPABASE_POSTGRES_USER: !!process.env.SUPABASE_POSTGRES_USER,
    SUPABASE_POSTGRES_PASSWORD: !!process.env.SUPABASE_POSTGRES_PASSWORD,
    SUPABASE_POSTGRES_HOST: !!process.env.SUPABASE_POSTGRES_HOST,
    SUPABASE_POSTGRES_DATABASE: !!process.env.SUPABASE_POSTGRES_DATABASE,
  }

  // Check if all required variables are set
  const allRequiredVarsSet = envVars.NEXT_PUBLIC_SUPABASE_URL && envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Check if all database variables are set
  const allDbVarsSet =
    envVars.SUPABASE_POSTGRES_URL &&
    envVars.SUPABASE_POSTGRES_USER &&
    envVars.SUPABASE_POSTGRES_PASSWORD &&
    envVars.SUPABASE_POSTGRES_HOST &&
    envVars.SUPABASE_POSTGRES_DATABASE

  return NextResponse.json({
    success: allRequiredVarsSet,
    environment: envVars,
    status: {
      requiredVarsSet: allRequiredVarsSet,
      databaseVarsSet: allDbVarsSet,
      serviceRoleKeySet: envVars.SUPABASE_SERVICE_ROLE_KEY,
    },
    timestamp: new Date().toISOString(),
  })
}
