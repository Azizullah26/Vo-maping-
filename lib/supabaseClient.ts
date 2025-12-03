"use client"

import { createClient as supabaseCreateClient } from "@supabase/supabase-js"

// Create a singleton instance of the Supabase client
let supabaseInstance: any = null

export function getSupabaseClient() {
  if (supabaseInstance) return supabaseInstance

  // For client-side usage, only use NEXT_PUBLIC_ prefixed variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Missing Supabase environment variables, using mock client for demo mode")
    return createMockClient()
  }

  try {
    supabaseInstance = supabaseCreateClient(supabaseUrl, supabaseAnonKey, {
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

// Create a mock client for demo mode
function createMockClient() {
  return {
    storage: {
      from: () => ({
        upload: async () => ({ data: { path: "demo/file.pdf" }, error: null }),
        getPublicUrl: async () => ({ data: { publicUrl: "https://example.com/demo/file.pdf" } }),
        remove: async () => ({ data: null, error: null }),
      }),
    },
    from: () => ({
      insert: () => ({
        select: () => ({
          single: async () => ({ data: { id: `demo-${Date.now()}` }, error: null }),
        }),
      }),
      select: async () => ({ data: [], error: null }),
      delete: async () => ({ data: null, error: null }),
    }),
  }
}

// This allows `import { supabase }` to work without executing at module load time
export const supabase = new Proxy({} as ReturnType<typeof getSupabaseClient>, {
  get(_, prop) {
    const client = getSupabaseClient()
    return client[prop as keyof typeof client]
  },
})

export { supabaseCreateClient as createClient }
export const getSupabase = getSupabaseClient
