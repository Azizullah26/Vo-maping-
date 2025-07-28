import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Get environment variables with fallbacks for build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

// Check if configuration is valid (not demo/placeholder values)
function isValidConfig(url: string, key: string): boolean {
  const isDemoUrl = url.includes("demo.supabase.co") || url === "" || url.includes("your-project")
  const isDemoKey = key.includes("demo_anon_key") || key === "" || key.includes("your-anon-key")
  return !isDemoUrl && !isDemoKey
}

// Create client function with error handling
export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase environment variables not configured")
    return null
  }

  if (!isValidConfig(supabaseUrl, supabaseAnonKey)) {
    console.warn("Supabase is using demo/placeholder configuration - skipping connection")
    return null
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

// Main client instance with null fallback
export const supabase = supabaseUrl && supabaseAnonKey && isValidConfig(supabaseUrl, supabaseAnonKey)
  ? createSupabaseClient(supabaseUrl, supabaseAnonKey)
  : null

// Admin client for server-side operations with null fallback
export const supabaseAdmin =
  supabaseUrl && supabaseServiceRoleKey && isValidConfig(supabaseUrl, supabaseServiceRoleKey)
    ? createSupabaseClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null

// Test connection function
export async function testSupabaseConnection() {
  try {
    if (!supabase) {
      return { success: false, error: "Supabase not configured or using demo configuration" }
    }

    const { data, error } = await supabase.from("projects").select("count", { count: "exact", head: true })
    if (error) throw error
    return { success: true, message: "Connection successful" }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// Check if Supabase is configured
export function isSupabaseConfigured() {
  return !!(supabaseUrl && supabaseAnonKey && isValidConfig(supabaseUrl, supabaseAnonKey))
}

// Default export with null fallback
export default supabase
