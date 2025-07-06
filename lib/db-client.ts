import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { type DatabaseType, databaseEnvVars, isDatabaseConfigured } from "./database-config"

// Singleton instances
let supabaseInstance: ReturnType<typeof createSupabaseClient> | null = null

/**
 * Get a Supabase client
 */
export function getSupabaseClient(useAdmin = false) {
  if (!isDatabaseConfigured("supabase")) {
    console.error("Supabase is not configured")
    return null
  }

  if (useAdmin && typeof window !== "undefined") {
    console.error("Admin client cannot be used on the client side")
    return null
  }

  if (!supabaseInstance || useAdmin) {
    const { url, anonKey, serviceKey } = databaseEnvVars.supabase
    const key = useAdmin ? serviceKey : anonKey

    if (!url || !key) {
      console.error("Missing Supabase credentials")
      return null
    }

    // Create a new instance for admin to avoid caching it
    if (useAdmin) {
      return createSupabaseClient(url, key, {
        auth: { persistSession: false },
      })
    }

    // Create and cache the regular client
    supabaseInstance = createSupabaseClient(url, anonKey!, {
      auth: { persistSession: true },
    })
  }

  return supabaseInstance
}

/**
 * Get the appropriate database client for a feature
 */
export function getDatabaseClient(type: DatabaseType, useAdmin = false) {
  switch (type) {
    case "supabase":
      return getSupabaseClient(useAdmin)
    default:
      console.error(`Unknown database type: ${type}`)
      return null
  }
}

/**
 * Test connection to all configured databases
 */
export async function testDatabaseConnections() {
  const results: Record<string, { success: boolean; message: string }> = {}

  // Test Supabase
  if (isDatabaseConfigured("supabase")) {
    try {
      const supabase = getSupabaseClient()
      // Use a simple query that doesn't require a specific table to exist
      const { data, error } = await supabase!.rpc("get_db_version") // Assuming get_db_version exists as an RPC

      results.supabase = {
        success: !error,
        message: error ? error.message : `Connection successful (DB Version: ${data})`,
      }
    } catch (error) {
      results.supabase = {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  return results
}
