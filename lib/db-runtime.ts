import { neon } from "@neondatabase/serverless"

// SQL client using neon
let sql: ReturnType<typeof neon> | null = null

/**
 * Check if the database connection is working
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    if (!sql) {
      const connectionString = process.env.POSTGRES_URL || process.env.NILEDB_POSTGRES_URL

      if (!connectionString) {
        console.error("Database connection string not found in environment variables")
        return false
      }

      sql = neon(connectionString)
    }

    // Test the connection
    await sql`SELECT 1`
    return true
  } catch (error) {
    console.error("Database connection check failed:", error)
    return false
  }
}
