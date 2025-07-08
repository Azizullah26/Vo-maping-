import { createClient as createSupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Create client function
export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

// Main client instance
export const supabase = createClient()

// Admin client for server-side operations
export const supabaseAdmin = supabaseServiceKey
  ? createSupabaseClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null

// Test connection function
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from("projects").select("count").limit(1)
    if (error) {
      console.error("Supabase connection test failed:", error)
      return { success: false, error: error.message }
    }
    return { success: true, data }
  } catch (error) {
    console.error("Supabase connection test error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// Check if Supabase is properly configured
export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey)
}

// Default export
export default supabase
