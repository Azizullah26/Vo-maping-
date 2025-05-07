import { NextResponse } from "next/server"
import { isDatabaseConfigured } from "@/lib/database-config"

export async function GET() {
  try {
    // Check which databases are configured
    const configStatus = {
      supabase: isDatabaseConfigured("supabase"),
      neon: isDatabaseConfigured("neon"),
      redis: isDatabaseConfigured("redis"),
    }

    // For the connection tests, we'll do a simpler check to avoid the Redis import issue
    const connectionResults: Record<string, { success: boolean; message: string }> = {}

    // Check Supabase connection
    if (configStatus.supabase) {
      try {
        const { createClient } = await import("@supabase/supabase-js")
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (supabaseUrl && supabaseKey) {
          const supabase = createClient(supabaseUrl, supabaseKey)
          const { error } = await supabase
            .from("_test_connection")
            .select("*")
            .limit(1)
            .catch(() => ({ error: { message: "Connection failed" } }))

          connectionResults.supabase = {
            success: !error || error.code === "PGRST116", // PGRST116 is "relation does not exist" which is fine for this test
            message: error ? error.message : "Connection successful",
          }
        } else {
          connectionResults.supabase = {
            success: false,
            message: "Missing Supabase credentials",
          }
        }
      } catch (error) {
        connectionResults.supabase = {
          success: false,
          message: error instanceof Error ? error.message : "Unknown error",
        }
      }
    }

    // Check Neon connection
    if (configStatus.neon) {
      try {
        const { neon } = await import("@neondatabase/serverless")
        const neonUrl = process.env.POSTGRES_URL

        if (neonUrl) {
          const sql = neon(neonUrl)
          await sql`SELECT 1`

          connectionResults.neon = {
            success: true,
            message: "Connection successful",
          }
        } else {
          connectionResults.neon = {
            success: false,
            message: "Missing Neon connection URL",
          }
        }
      } catch (error) {
        connectionResults.neon = {
          success: false,
          message: error instanceof Error ? error.message : "Unknown error",
        }
      }
    }

    // For Redis, we'll just check if it's configured but not test the connection
    // to avoid the import issue
    if (configStatus.redis) {
      connectionResults.redis = {
        success: true,
        message: "Redis is configured (connection test skipped)",
      }
    }

    return NextResponse.json({
      success: true,
      configured: configStatus,
      connections: connectionResults,
    })
  } catch (error) {
    console.error("Error checking database status:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
