import { createClient } from "@supabase/supabase-js"

// Singleton pattern for Supabase client
let supabaseInstance: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (supabaseInstance) return supabaseInstance

  // Try Next.js style environment variables first
  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Fall back to React App style environment variables if needed
  if (!supabaseUrl) supabaseUrl = process.env.REACT_APP_SUPABASE_URL
  if (!supabaseAnonKey) supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Missing Supabase environment variables, using placeholder client")
    // Return a placeholder client during build time to prevent build failures
    supabaseInstance = createClient(
      supabaseUrl || "https://placeholder.supabase.co",
      supabaseAnonKey || "placeholder-anon-key",
      {
        auth: {
          persistSession: false,
        },
      },
    )
    return supabaseInstance
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
      console.warn("Missing Supabase admin credentials, returning null")
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

    // Check if we have valid credentials
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes("placeholder")) {
      return {
        success: false,
        message: "Supabase environment variables not configured",
      }
    }

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

// Create a safer version that checks for server-side execution and valid environment variables
export const supabaseAdmin = (() => {
  if (typeof window !== "undefined") {
    return null // Client-side, return null
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey || supabaseUrl.includes("placeholder")) {
    return null // Missing or placeholder credentials
  }

  try {
    return createClient(supabaseUrl, supabaseServiceKey)
  } catch (error) {
    console.error("Error creating supabaseAdmin:", error)
    return null
  }
})()

// Minimal Supabase client stub for future use
// Not actively used in the application
export const createClientStub = () => {
  console.warn("Supabase is not configured for this project")
  return null
}

export const supabaseStub = null

export function getSupabaseServerClient() {
  if (typeof window !== "undefined") {
    console.warn("getSupabaseServerClient should only be used on the server")
    return null
  }
  return getSupabaseClient()
}
