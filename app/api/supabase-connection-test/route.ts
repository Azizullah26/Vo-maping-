import { NextResponse } from "next/server"
import { testSupabaseConnection } from "@/lib/supabase-connection-test"

export async function GET() {
  try {
    const result = await testSupabaseConnection()

    return NextResponse.json(result)
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
