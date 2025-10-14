import { createClient } from "@supabase/supabase-js"

export interface ConnectionTestResult {
  success: boolean
  message: string
  details?: {
    url?: string
    timestamp: string
    error?: string
  }
}

export interface AuthTestResult {
  success: boolean
  message: string
  canSignUp: boolean
  canSignIn: boolean
}

export interface StorageTestResult {
  success: boolean
  message: string
  canList: boolean
}

export interface ComprehensiveTestResult {
  connection: ConnectionTestResult
  auth: AuthTestResult
  storage: StorageTestResult
  overall: {
    success: boolean
    timestamp: string
  }
}

/**
 * Test Supabase connection using the client library
 */
export async function testSupabaseConnection(): Promise<ConnectionTestResult> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return {
        success: false,
        message: "Supabase credentials not configured",
        details: {
          timestamp: new Date().toISOString(),
          error: "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
        },
      }
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Test connection by trying to list tables
    const { error } = await supabase.from("_test_connection").select("*").limit(1)

    // If error is about table not existing, connection is still good
    const isConnectionGood = !error || error.message.includes("relation") || error.message.includes("does not exist")

    return {
      success: isConnectionGood,
      message: isConnectionGood ? "Supabase connection successful" : `Connection failed: ${error?.message}`,
      details: {
        url: supabaseUrl,
        timestamp: new Date().toISOString(),
        error: error?.message,
      },
    }
  } catch (error) {
    return {
      success: false,
      message: `Connection test failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      details: {
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
    }
  }
}

/**
 * Test Supabase authentication capabilities
 */
export async function testSupabaseAuth(): Promise<AuthTestResult> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return {
        success: false,
        message: "Supabase credentials not configured",
        canSignUp: false,
        canSignIn: false,
      }
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Test if auth endpoint is accessible
    const { data, error } = await supabase.auth.getSession()

    return {
      success: !error,
      message: error ? `Auth test failed: ${error.message}` : "Auth endpoint accessible",
      canSignUp: !error,
      canSignIn: !error,
    }
  } catch (error) {
    return {
      success: false,
      message: `Auth test failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      canSignUp: false,
      canSignIn: false,
    }
  }
}

/**
 * Test Supabase storage capabilities
 */
export async function testSupabaseStorage(): Promise<StorageTestResult> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return {
        success: false,
        message: "Supabase credentials not configured",
        canList: false,
      }
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Test storage by listing buckets
    const { data, error } = await supabase.storage.listBuckets()

    return {
      success: !error,
      message: error ? `Storage test failed: ${error.message}` : "Storage endpoint accessible",
      canList: !error,
    }
  } catch (error) {
    return {
      success: false,
      message: `Storage test failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      canList: false,
    }
  }
}

/**
 * Run comprehensive Supabase tests
 */
export async function comprehensiveSupabaseTest(): Promise<ComprehensiveTestResult> {
  const connection = await testSupabaseConnection()
  const auth = await testSupabaseAuth()
  const storage = await testSupabaseStorage()

  const overallSuccess = connection.success && auth.success && storage.success

  return {
    connection,
    auth,
    storage,
    overall: {
      success: overallSuccess,
      timestamp: new Date().toISOString(),
    },
  }
}
