import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  return NextResponse.json(
    {
      success: false,
      message:
        "EdgeDB integration has been removed to reduce deployment size. Please use Supabase for database operations.",
      error: "EdgeDB package not available",
    },
    { status: 503 },
  )
}
