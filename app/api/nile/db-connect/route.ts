import type { NextRequest } from "next/server"
import { safeJsonResponse, withErrorHandling } from "@/lib/api-utils"
import { Pool } from "pg"

/**
 * API route for testing the PostgreSQL database connection
 * GET /api/nile/db-connect
 */
export const GET = withErrorHandling(async (req: NextRequest) => {
  try {
    console.log("GET /api/nile/db-connect: Testing PostgreSQL connection")

    // Create a connection pool using environment variables
    const pool = new Pool({
      user: process.env.NILEDB_USER,
      password: process.env.NILEDB_PASSWORD,
      host: process.env.NILEDB_HOST,
      port: Number.parseInt(process.env.NILEDB_PORT || "5432"),
      database: process.env.NILEDB_DATABASE,
      ssl: {
        rejectUnauthorized: false, // For development, consider changing for production
      },
      // Connection timeout of 10 seconds
      connectionTimeoutMillis: 10000,
    })

    // Test the connection
    console.log("Connecting to PostgreSQL database...")
    const client = await pool.connect()
    console.log("Connected to PostgreSQL database")

    // Get database version
    const versionResult = await client.query("SELECT version()")
    const version = versionResult.rows[0].version

    // Get current timestamp
    const timeResult = await client.query("SELECT NOW() as time")
    const time = timeResult.rows[0].time

    // Get list of tables
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `)
    const tables = tablesResult.rows

    // Release the client
    client.release()

    // Close the pool
    await pool.end()

    return safeJsonResponse({
      success: true,
      connection: {
        connected: true,
        version,
        time,
        message: "PostgreSQL connection successful",
      },
      tables,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error connecting to PostgreSQL database:", error)
    return safeJsonResponse(
      {
        success: false,
        connection: {
          connected: false,
          message: error instanceof Error ? error.message : "Unknown error connecting to PostgreSQL database",
        },
        timestamp: new Date().toISOString(),
      },
      500,
    )
  }
})
