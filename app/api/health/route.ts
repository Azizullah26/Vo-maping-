import { NextResponse } from "next/server"
import { Pool } from "pg"

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

  // Test database connection
  try {
    const pool = new Pool({
      connectionString: process.env.NILEDB_POSTGRES_URL,
      ssl: process.env.VERCEL_ENV === "production" ? { rejectUnauthorized: false } : false,
    })

    const client = await pool.connect()
    try {
      await client.query("SELECT 1")
      healthStatus.database.status = "healthy"
      healthStatus.database.message = "Connection successful"
    } finally {
      client.release()
    }
  } catch (error) {
    healthStatus.database.status = "error"
    healthStatus.database.message = error instanceof Error ? error.message : "Unknown error"
  }

  return NextResponse.json(healthStatus)
}
