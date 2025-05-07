import { NextResponse } from "next/server"
import { getDatabaseClient } from "@/lib/db-client"

export async function GET() {
  const healthStatus = {
    api: {
      status: "healthy",
      timestamp: new Date().toISOString(),
    },
    database: {
      status: "unknown",
      message: "",
      timestamp: new Date().toISOString(),
    },
    environment: {
      VERCEL_ENV: process.env.VERCEL_ENV || "not set",
      NODE_ENV: process.env.NODE_ENV || "not set",
      hasNileDbUrl: !!process.env.NILEDB_POSTGRES_URL,
    },
  }

  // Test database connection using the serverless-compatible client
  try {
    // Use Supabase client instead of direct pg connection
    const supabase = getDatabaseClient("supabase")

    if (supabase) {
      // Simple query to test connection
      const { error } = await supabase.from("_test_connection").select("*").limit(1)

      // PGRST116 is "relation does not exist" which is fine for this test
      if (!error || error.code === "PGRST116") {
        healthStatus.database.status = "healthy"
        healthStatus.database.message = "Connection successful"
      } else {
        throw new Error(error.message)
      }
    } else {
      healthStatus.database.status = "warning"
      healthStatus.database.message = "Database client not configured"
    }
  } catch (error) {
    healthStatus.database.status = "error"
    healthStatus.database.message = error instanceof Error ? error.message : "Unknown error"
  }

  return NextResponse.json(healthStatus)
}
