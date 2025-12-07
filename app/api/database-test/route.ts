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
          const { data, error } = await supabase.from("documents").select("*").limit(5)

          connectionResults.supabase = {
            success: !error,
            message: error ? error.message : "Connection successful",
          }

          // Return document data if available
          return NextResponse.json({
            success: true,
            connections: connectionResults,
            documents: {
              count: data?.length || 0,
              sample: data?.slice(0, 2) || [],
            },
          })
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
          const result = await sql`SELECT 1 as test`

          connectionResults.neon = {
            success: true,
            message: "Connection successful",
            data: result,
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
    if (configStatus.redis) {
      connectionResults.redis = {
        success: true,
        message: "Redis is configured (connection test skipped)",
      }
    }

    // Static data configuration message
    return NextResponse.json({
      success: true,
      connections: connectionResults,
      documents: {
        count: 0,
        sample: [],
      },
      message: "Application configured for static data",
      mode: "static",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in database test:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Application configured for static data",
        mode: "static",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
