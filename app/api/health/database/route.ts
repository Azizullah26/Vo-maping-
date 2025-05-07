import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  const healthStatus = {
    database: {
      status: "unknown",
      message: "",
      timestamp: new Date().toISOString(),
    },
  }

  // Only run this check if we have the required environment variables
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      // Create a temporary client just for this health check
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

      // Simple query to test connection
      const { error } = await supabase.from("_test_connection").select("*").limit(1)

      // PGRST116 is "relation does not exist" which is fine for this test
      if (!error || error.code === "PGRST116") {
        healthStatus.database.status = "healthy"
        healthStatus.database.message = "Connection successful"
      } else {
        throw new Error(error.message)
      }
    } catch (error) {
      healthStatus.database.status = "error"
      healthStatus.database.message = error instanceof Error ? error.message : "Unknown error"
    }
  } else {
    healthStatus.database.status = "warning"
    healthStatus.database.message = "Database credentials not configured"
  }

  return NextResponse.json(healthStatus)
}
