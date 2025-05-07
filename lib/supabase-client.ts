import { createClient } from "@supabase/supabase-js"

// Singleton pattern for Supabase client
let supabaseInstance: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (supabaseInstance) return supabaseInstance

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

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

// Create a server-side client using service role - ONLY USE IN SERVER COMPONENTS OR API ROUTES
export function getSupabaseAdminClient() {
  try {
    const supabaseUrl = process.env.SUPABASE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase admin credentials")
      return null
    }

    return createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
      },
      // Add global fetch timeout
      global: {
        fetch: (url, options) => {
          return fetch(url, {
            ...options,
            signal: AbortSignal.timeout(5000), // 5 second timeout
          })
        },
      },
    })
  } catch (error) {
    console.error("Error creating Supabase admin client:", error)
    return null
  }
}

// For backward compatibility - alias to getSupabaseAdminClient
export const getSupabaseAdmin = getSupabaseAdminClient

// Helper function to check if Supabase is configured
export async function checkSupabaseConnection() {
  try {
    const supabase = getSupabaseClient()

    // Try a simple query to check the connection
    const { error } = await supabase.from("projects").select("count", { count: "exact", head: true })

    return {
      success: !error,
      message: error ? error.message : "Connection successful",
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Export a default client for convenience
const supabase = getSupabaseClient()
export default supabase

// Remove this export that exposes the admin client directly
// export const supabaseAdmin = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL || "",
//   process.env.SUPABASE_SERVICE_ROLE_KEY || "",
// )

// Instead, create a safer version that checks for server-side execution
export const supabaseAdmin =
  typeof window === "undefined"
    ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.SUPABASE_SERVICE_ROLE_KEY || "")
    : null
