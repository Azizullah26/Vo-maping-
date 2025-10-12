"use server"

import { getNileServerSingleton } from "@/lib/nile"
import { getPool } from "@/lib/nileDb"

export async function testNileConnection() {
  try {
    // Test Nile SDK connection
    const nile = await getNileServerSingleton()
    const tenants = await nile.api("/v1/tenants", { method: "GET" })

    // Test direct Postgres connection
    const pool = await getPool()
    const client = await pool.connect()
    try {
      const result = await client.query("SELECT NOW() as current_time")
      return {
        success: true,
        message: "Successfully connected to Nile database",
        time: result.rows[0].current_time,
        tenants: tenants,
      }
    } finally {
      client.release()
    }
  } catch (error) {
    console.error("Error testing Nile connection:", error)
    return {
      success: false,
      message: "Failed to connect to Nile database",
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
