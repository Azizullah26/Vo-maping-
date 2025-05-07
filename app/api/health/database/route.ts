import { NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase-client"

export async function GET() {
  try {
    const startTime = Date.now()
    const supabase = getSupabaseClient()

    // Test database connection with a simple query
    const { data, error } = await supabase.from("documents").select("count", { count: "exact", head: true })

    if (error) {
      throw error
    }

    const responseTime = Date.now() - startTime

    return NextResponse.json(
      {
        status: "ok",
        database: "supabase",
        responseTime: `${responseTime}ms`,
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Database health check failed:", error)

    return NextResponse.json(
      {
        status: "error",
        message: "Database health check failed",
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
