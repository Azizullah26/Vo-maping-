import { NextResponse } from "next/server"
import { testDatabaseConnections } from "@/lib/db-client"
import { isDatabaseConfigured } from "@/lib/database-config"

export async function GET() {
  try {
    // Check which databases are configured
    const configStatus = {
      supabase: isDatabaseConfigured("supabase"),
      neon: isDatabaseConfigured("neon"),
      redis: isDatabaseConfigured("redis"),
    }

    // Test connections to all configured databases
    const connectionResults = await testDatabaseConnections()

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
