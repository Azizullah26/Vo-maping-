import { createClient } from "@supabase/supabase-js"
import { getEnvVariable } from "./env-utils"

// Singleton pattern for Supabase client - lazy initialization
let supabaseInstance: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (supabaseInstance) return supabaseInstance

  const supabaseUrl = getEnvVariable("SUPABASE_URL")
  const supabaseAnonKey = getEnvVariable("SUPABASE_ANON_KEY")

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Missing Supabase environment variables, returning mock client")
    return createMockClient()
  }

  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    })
    return supabaseInstance
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    return createMockClient()
  }
}

// Create a mock client for when Supabase is not configured
function createMockClient() {
  return {
    storage: {
      from: () => ({
        upload: async () => ({ data: { path: "demo/file.pdf" }, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: "https://example.com/demo/file.pdf" } }),
        remove: async () => ({ data: null, error: null }),
        list: async () => ({ data: [], error: null }),
      }),
    },
    from: () => ({
      insert: () => ({
        select: () => ({
          single: async () => ({ data: { id: `demo-${Date.now()}` }, error: null }),
        }),
      }),
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: null }),
          order: async () => ({ data: [], error: null }),
        }),
        order: async () => ({ data: [], error: null }),
        or: () => ({
          order: async () => ({ data: [], error: null }),
        }),
      }),
      update: () => ({
        eq: () => ({
          select: async () => ({ data: [], error: null }),
        }),
      }),
      delete: () => ({
        eq: async () => ({ error: null }),
      }),
    }),
    rpc: async () => ({ data: null, error: null }),
  } as any
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

// This defers client creation until first access at runtime
const supabase = new Proxy({} as ReturnType<typeof getSupabaseClient>, {
  get(_, prop) {
    const client = getSupabaseClient()
    return (client as any)[prop]
  },
})

export default supabase
