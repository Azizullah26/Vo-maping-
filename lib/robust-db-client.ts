import { getSupabaseClient as getSharedSupabaseClient } from "./supabase-client"

// Configuration
const MAX_RETRIES = 3
const RETRY_DELAY_MS = 1000

// Circuit breaker state
let circuitOpen = false
let lastFailureTime = 0
const CIRCUIT_RESET_TIMEOUT_MS = 30000 // 30 seconds

export class RobustDbClient {
  /**
   * Get the shared singleton Supabase client
   */
  private static getSupabaseClient() {
    const client = getSharedSupabaseClient()
    if (!client) throw new Error("Supabase client not available")
    return client
  }

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

    let attempts = 0

    while (attempts < retries) {
      attempts++
      try {
        // Get Supabase client
        const supabase = this.getSupabaseClient()

        // Execute query using RPC
        const { data, error } = await supabase.rpc("execute_sql", {
          query_text: queryText,
          query_params: params,
        })

        if (error) throw error

        // Success - return the result
        return { success: true, data: data as T }
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
      const supabase = this.getSupabaseClient()
      const { data, error } = await supabase.rpc("get_db_version")

      if (error) {
        return { success: false, message: error.message }
      }

      return { success: true, message: "Database connection successful" }
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
