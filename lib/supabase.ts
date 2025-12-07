import { createClient as createSupabaseClient } from "@supabase/supabase-js"

function getEnvVars() {
  return {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  }
}

// Create client function with error handling - only called when needed
export function createClient() {
  const { supabaseUrl, supabaseAnonKey } = getEnvVars()

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase environment variables not configured")
    return null
  }
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

let _supabaseInstance: ReturnType<typeof createSupabaseClient> | null | undefined

export function getSupabase() {
  if (_supabaseInstance === undefined) {
    const { supabaseUrl, supabaseAnonKey } = getEnvVars()
    _supabaseInstance = supabaseUrl && supabaseAnonKey ? createSupabaseClient(supabaseUrl, supabaseAnonKey) : null
  }
  return _supabaseInstance
}

// Keeping for backwards compatibility but recommend using getSupabase() directly
export const supabase = null as any

let _supabaseAdminInstance: ReturnType<typeof createSupabaseClient> | null | undefined

export function getSupabaseAdmin() {
  if (_supabaseAdminInstance === undefined) {
    const { supabaseUrl, supabaseServiceRoleKey } = getEnvVars()
    _supabaseAdminInstance =
      supabaseUrl && supabaseServiceRoleKey
        ? createSupabaseClient(supabaseUrl, supabaseServiceRoleKey, {
            auth: {
              autoRefreshToken: false,
              persistSession: false,
            },
          })
        : null
  }
  return _supabaseAdminInstance
}

export const supabaseAdmin = null as any

// Test connection function
export async function testSupabaseConnection() {
  try {
    const supabaseInstance = getSupabase()
    if (!supabaseInstance) {
      return { success: false, error: "Supabase not configured" }
    }

    const { data, error } = await supabaseInstance.from("projects").select("count", { count: "exact", head: true })
    if (error) throw error
    return { success: true, message: "Connection successful" }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// Check if Supabase is configured
export function isSupabaseConfigured() {
  const { supabaseUrl, supabaseAnonKey } = getEnvVars()
  return !!(supabaseUrl && supabaseAnonKey)
}

export default null as any
