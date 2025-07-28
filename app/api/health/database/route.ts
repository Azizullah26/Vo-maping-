import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/db"

export async function GET() {
  try {
    const supabase = getSupabaseServerClient()

    // Test database connection with a simple query
    const { data, error } = await supabase.from("projects").select("count").limit(1)

    if (error) {
      return NextResponse.json(
        {
          status: "unhealthy",
          error: error.message,
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      status: "healthy",
      message: "Database connection successful",
      timestamp: new Date().toISOString(),
      data: data,
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown database error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
