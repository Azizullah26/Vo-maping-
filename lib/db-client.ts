import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { neon } from "@neondatabase/serverless"
import { Redis } from "@upstash/redis"
import { type DatabaseType, databaseEnvVars, isDatabaseConfigured } from "./database-config"

// Singleton instances
let supabaseInstance: ReturnType<typeof createSupabaseClient> | null = null
let neonInstance: ReturnType<typeof neon> | null = null
let redisInstance: Redis | null = null

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
 * Get a Neon PostgreSQL client
 */
export function getNeonClient() {
  if (!isDatabaseConfigured("neon")) {
    console.error("Neon is not configured")
    return null
  }

  if (!neonInstance) {
    const { url } = databaseEnvVars.neon

    if (!url) {
      console.error("Missing Neon connection URL")
      return null
    }

    try {
      neonInstance = neon(url)
    } catch (error) {
      console.error("Failed to initialize Neon client:", error)
      return null
    }
  }

  return neonInstance
}

/**
 * Get a Redis client
 */
export function getRedisClient() {
  if (!isDatabaseConfigured("redis")) {
    console.error("Redis is not configured")
    return null
  }

  if (!redisInstance) {
    const { url, token } = databaseEnvVars.redis

    if (!url || !token) {
      console.error("Missing Redis credentials")
      return null
    }

    try {
      redisInstance = new Redis({
        url,
        token,
      })
    } catch (error) {
      console.error("Failed to initialize Redis client:", error)
      return null
    }
  }

  return redisInstance
}

/**
 * Get the appropriate database client for a feature
 */
export function getDatabaseClient(type: DatabaseType, useAdmin = false) {
  switch (type) {
    case "supabase":
      return getSupabaseClient(useAdmin)
    case "neon":
      return getNeonClient()
    case "redis":
      return getRedisClient()
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
      const { error } = await supabase!.from("_test_connection").select("*").limit(1)

      results.supabase = {
        success: !error || error.code === "PGRST116", // PGRST116 is "relation does not exist" which is fine for this test
        message: error ? error.message : "Connection successful",
      }
    } catch (error) {
      results.supabase = {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  // Test Neon
  if (isDatabaseConfigured("neon")) {
    try {
      const neon = getNeonClient()
      await neon!`SELECT 1`

      results.neon = {
        success: true,
        message: "Connection successful",
      }
    } catch (error) {
      results.neon = {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  // Test Redis
  if (isDatabaseConfigured("redis")) {
    try {
      const redis = getRedisClient()
      await redis!.ping()

      results.redis = {
        success: true,
        message: "Connection successful",
      }
    } catch (error) {
      results.redis = {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  return results
}
