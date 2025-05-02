import { NextResponse } from "next/server"
import { testSupabaseConnection, testDirectPostgresConnection } from "@/lib/supabase-direct-connection"

export async function GET() {
  try {
    // Test both connection methods
    const supabaseResult = await testSupabaseConnection()
    const directResult = await testDirectPostgresConnection()

    return NextResponse.json({
      supabase: supabaseResult,
      direct: directResult,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: `Server error: ${error instanceof Error ? error.message : String(error)}`,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
