/**
 * Supabase Connection Test Module
 * Provides connection testing functionality for Supabase
 */

export interface ConnectionTestResult {
  success: boolean
  message: string
  timestamp: string
  details?: any
}

/**
 * Tests the Supabase connection
 * @returns Promise with connection test result
 */
export async function testSupabaseConnection(): Promise<ConnectionTestResult> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return {
        success: false,
        message: "Supabase credentials not configured",
        timestamp: new Date().toISOString(),
      }
    }

    // Check if Supabase is available
    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Try a simple query
    const { error } = await supabase.from("projects").select("count", { count: "exact", head: true })

    return {
      success: !error,
      message: error ? error.message : "Connection successful",
      timestamp: new Date().toISOString(),
      details: {
        url: supabaseUrl.substring(0, 20) + "...",
        hasKey: !!supabaseKey,
      },
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Connection test failed",
      timestamp: new Date().toISOString(),
    }
  }
}

/**
 * Tests Supabase authentication
 */
export async function testSupabaseAuth(): Promise<ConnectionTestResult> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return {
        success: false,
        message: "Supabase credentials not configured",
        timestamp: new Date().toISOString(),
      }
    }

    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data, error } = await supabase.auth.getSession()

    return {
      success: !error,
      message: error ? error.message : "Auth check successful",
      timestamp: new Date().toISOString(),
      details: {
        hasSession: !!data.session,
      },
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Auth test failed",
      timestamp: new Date().toISOString(),
    }
  }
}

/**
 * Tests Supabase storage
 */
export async function testSupabaseStorage(): Promise<ConnectionTestResult> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return {
        success: false,
        message: "Supabase credentials not configured",
        timestamp: new Date().toISOString(),
      }
    }

    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data, error } = await supabase.storage.listBuckets()

    return {
      success: !error,
      message: error ? error.message : "Storage check successful",
      timestamp: new Date().toISOString(),
      details: {
        bucketCount: data?.length || 0,
      },
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Storage test failed",
      timestamp: new Date().toISOString(),
    }
  }
}

/**
 * Performs a comprehensive Supabase connection test
 */
export async function comprehensiveSupabaseTest(): Promise<{
  overall: boolean
  connection: ConnectionTestResult
  auth: ConnectionTestResult
  storage: ConnectionTestResult
}> {
  const connection = await testSupabaseConnection()
  const auth = await testSupabaseAuth()
  const storage = await testSupabaseStorage()

  return {
    overall: connection.success && auth.success && storage.success,
    connection,
    auth,
    storage,
  }
}
