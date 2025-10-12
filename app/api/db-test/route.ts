import { NextResponse } from "next/server"
import { Pool } from "pg"

export async function GET() {
  try {
    // Create a connection pool using the environment variable
    const pool = new Pool({
      connectionString: process.env.NILEDB_POSTGRES_URL,
      ssl: process.env.VERCEL_ENV === "production" ? { rejectUnauthorized: false } : false,
    })

    // Test the connection with a simple query
    const client = await pool.connect()
    try {
      const result = await client.query("SELECT NOW() as time")
      return NextResponse.json({
        success: true,
        message: "Database connection successful",
        time: result.rows[0].time,
        connectionString: process.env.NILEDB_POSTGRES_URL
          ? `${process.env.NILEDB_POSTGRES_URL.substring(0, 15)}...`
          : "Not set",
      })
    } finally {
      // Release the client back to the pool
      client.release()
    }
  } catch (error) {
    console.error("Database connection error:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown database error",
        error: error instanceof Error ? error.toString() : "Unknown error",
      },
      { status: 500 },
    )
  }
}
