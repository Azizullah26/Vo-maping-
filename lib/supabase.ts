import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Environment variables validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

// Create client function (named export)
export function createClient() {
  return createSupabaseClient<Database>(supabaseUrl!, supabaseAnonKey!)
}

// Main client instance
export const supabase = createSupabaseClient<Database>(supabaseUrl!, supabaseAnonKey!)

// Admin client for server-side operations
export const supabaseAdmin = supabaseServiceRoleKey
  ? createSupabaseClient<Database>(supabaseUrl!, supabaseServiceRoleKey!)
  : null

// Test connection function
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from("projects").select("count").limit(1)
    if (error) throw error
    return { success: true, message: "Connection successful" }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Connection failed",
    }
  }
}

// Check if Supabase is properly configured
export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey)
}

// Default export
export default supabase
