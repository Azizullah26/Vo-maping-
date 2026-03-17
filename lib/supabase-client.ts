import { createClient } from "@supabase/supabase-js"

// Use globalThis to persist the singleton across HMR reloads in development
const g = globalThis as typeof globalThis & {
  __supabaseInstance?: ReturnType<typeof createClient> | null
}

// Reset cached instance so new env vars are picked up immediately
g.__supabaseInstance = undefined

/** Resolve the best available Supabase key from env vars */
function resolveKey(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.REACT_APP_SUPABASE_ANON_KEY
  )
}

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL
  const key = resolveKey()
  return !!(url && key && !url.includes("placeholder"))
}

export function getSupabaseClient() {
  if (g.__supabaseInstance) return g.__supabaseInstance

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL
  const supabaseKey = resolveKey()

  if (!supabaseUrl || !supabaseKey) {
    console.warn("Missing Supabase environment variables, returning null — demo data will be used")
    return null
  }

  g.__supabaseInstance = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  })

  return g.__supabaseInstance
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
    const supabaseAnonKey = resolveKey()

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

// Export a getter function instead of executing at module load time
export function getDefaultSupabaseClient() {
  return getSupabaseClient()
}

// Use getSupabaseAdminClient() function instead
export function getSupabaseAdminInstance() {
  if (typeof window !== "undefined") {
    return null // Client-side, return null
  }
  return getSupabaseAdminClient()
}

// For backward compatibility - these are now null by default
// Use the getter functions instead
export const supabase = null
export const supabaseAdmin = null

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

export default null
