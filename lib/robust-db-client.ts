import { Pool, type PoolClient } from "pg"

// Configuration
const MAX_RETRIES = 3
const RETRY_DELAY_MS = 1000
const CONNECTION_TIMEOUT_MS = 5000

// Create a singleton pool
const pool = new Pool({
  connectionString: process.env.NILEDB_POSTGRES_URL,
  ssl: process.env.VERCEL_ENV === "production" ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: CONNECTION_TIMEOUT_MS,
})

// Circuit breaker state
let circuitOpen = false
let lastFailureTime = 0
const CIRCUIT_RESET_TIMEOUT_MS = 30000 // 30 seconds

export class RobustDbClient {
  /**
   * Execute a database query with retry logic and circuit breaker pattern
   */
  static async query<T>(
    queryText: string,
    params: any[] = [],
    options: { retries?: number; forceCircuit?: boolean } = {},
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    const retries = options.retries ?? MAX_RETRIES

    // Check if circuit breaker is open
    if (circuitOpen && !options.forceCircuit) {
      // Check if it's time to try again
      const now = Date.now()
      if (now - lastFailureTime < CIRCUIT_RESET_TIMEOUT_MS) {
        console.log("Circuit breaker open, skipping database query")
        return {
          success: false,
          error: "Database connection temporarily disabled due to previous failures",
        }
      } else {
        // Try to reset the circuit
        circuitOpen = false
      }
    }

    let client: PoolClient | null = null
    let attempts = 0

    while (attempts < retries) {
      attempts++
      try {
        // Get client from pool
        client = await pool.connect()

        // Execute query
        const result = await client.query(queryText, params)

        // Success - return the result
        return { success: true, data: result.rows as T }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown database error"
        console.error(`Database query error (attempt ${attempts}/${retries}):`, errorMessage)

        // If this is the last retry, open the circuit breaker
        if (attempts >= retries) {
          circuitOpen = true
          lastFailureTime = Date.now()
          return { success: false, error: errorMessage }
        }

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS))
      } finally {
        // Always release the client back to the pool
        if (client) client.release()
      }
    }

    // This should never happen due to the return in the catch block
    return { success: false, error: "Maximum retries exceeded" }
  }

  /**
   * Test the database connection
   */
  static async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const result = await this.query("SELECT NOW() as time", [], { forceCircuit: true })
      if (result.success) {
        return { success: true, message: "Database connection successful" }
      } else {
        return { success: false, message: result.error || "Unknown error" }
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error testing connection",
      }
    }
  }

  /**
   * Reset the circuit breaker
   */
  static resetCircuitBreaker(): void {
    circuitOpen = false
    console.log("Database circuit breaker manually reset")
  }
}

// Export a function to get the database client
export function getDbClient() {
  return RobustDbClient
}
