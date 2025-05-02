import { createClient } from "@supabase/supabase-js"
import { getEnvVariable } from "./env-utils"

// Singleton pattern for Supabase client
let supabaseInstance: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (supabaseInstance) return supabaseInstance

  const supabaseUrl = getEnvVariable("SUPABASE_URL")
  const supabaseAnonKey = getEnvVariable("SUPABASE_ANON_KEY")

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables")
    throw new Error("Missing Supabase environment variables")
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  })

  return supabaseInstance
}

// Test connection and return status
export async function testSupabaseConnection() {
  try {
    const supabase = getSupabaseClient()

    // Try a simple query to check the connection
    const { data, error } = await supabase.from("documents").select("count", { count: "exact", head: true })

    if (error) {
      return {
        success: false,
        message: `Connection error: ${error.message}`,
        error,
      }
    }

    return {
      success: true,
      message: "Successfully connected to Supabase",
      data,
    }
  } catch (error) {
    return {
      success: false,
      message: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
      error,
    }
  }
}

// Export a default client for convenience
const supabase = getSupabaseClient()
export default supabase
