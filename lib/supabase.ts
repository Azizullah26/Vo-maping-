import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://pbqfgjzvclwgxgvuzmul.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// For server-side operations
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Singleton pattern to avoid multiple instances
let supabaseInstance: ReturnType<typeof createClient> | null = null

/**
 * Creates a Supabase client for client-side usage
 */
export const getSupabaseClient = () => {
  if (supabaseInstance) return supabaseInstance

  if (!supabaseAnonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable")
  }

  supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })

  return supabaseInstance
}

/**
 * Creates a Supabase client with admin privileges for server-side operations
 * This should ONLY be used in server-side contexts (API routes, Server Actions)
 */
export const getSupabaseAdmin = () => {
  if (!supabaseServiceKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable")
  }

  // Don't cache the admin client for security reasons
  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
    },
  })
}

// Default export for convenience
const supabase = getSupabaseClient()
export default supabase
