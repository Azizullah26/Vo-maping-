import { createClient } from "@supabase/supabase-js"

export interface ConnectionTestResult {
  success: boolean
  message: string
  details?: any
  error?: string
  timestamp: string
}

/**
 * Tests Supabase connection using the JS client
 */
export async function testSupabaseConnection(): Promise<ConnectionTestResult> {
  const timestamp = new Date().toISOString()

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return {
        success: false,
        message: "Supabase credentials not configured",
        error: "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
        timestamp,
      }
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Simple connection test
    const { error } = await supabase.from("projects").select("count", { count: "exact", head: true })

    if (error) {
      return {
        success: false,
        message: "Connection failed",
        error: error.message,
        timestamp,
      }
    }

    return {
      success: true,
      message: "Connection successful",
      timestamp,
    }
  } catch (error) {
    return {
      success: false,
      message: "Connection test failed",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp,
    }
  }
}

/**
 * Tests Supabase authentication
 */
export async function testSupabaseAuth(): Promise<ConnectionTestResult> {
  const timestamp = new Date().toISOString()

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return {
        success: false,
        message: "Supabase credentials not configured",
        timestamp,
      }
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data, error } = await supabase.auth.getSession()

    return {
      success: !error,
      message: error ? "Auth check failed" : "Auth available",
      details: data ? { hasSession: !!data.session } : undefined,
      error: error?.message,
      timestamp,
    }
  } catch (error) {
    return {
      success: false,
      message: "Auth test failed",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp,
    }
  }
}

/**
 * Tests Supabase storage
 */
export async function testSupabaseStorage(): Promise<ConnectionTestResult> {
  const timestamp = new Date().toISOString()

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return {
        success: false,
        message: "Supabase credentials not configured",
        timestamp,
      }
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data, error } = await supabase.storage.listBuckets()

    return {
      success: !error,
      message: error ? "Storage check failed" : "Storage available",
      details: data ? { buckets: data.length } : undefined,
      error: error?.message,
      timestamp,
    }
  } catch (error) {
    return {
      success: false,
      message: "Storage test failed",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp,
    }
  }
}

/**
 * Comprehensive Supabase test
 */
export async function comprehensiveSupabaseTest() {
  const [connection, auth, storage] = await Promise.all([
    testSupabaseConnection(),
    testSupabaseAuth(),
    testSupabaseStorage(),
  ])

  return {
    overall: connection.success && auth.success && storage.success,
    tests: {
      connection,
      auth,
      storage,
    },
    timestamp: new Date().toISOString(),
  }
}
