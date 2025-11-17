import { createClient } from "@supabase/supabase-js"

interface ConnectionTestResult {
  success: boolean
  message: string
  details?: any
  timestamp: string
}

export async function testSupabaseConnection(): Promise<ConnectionTestResult> {
  const timestamp = new Date().toISOString()

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return {
        success: false,
        message: "Supabase credentials not configured",
        timestamp,
      }
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    })

    const { error } = await supabase.from("projects").select("count", { count: "exact", head: true })

    if (error) {
      return {
        success: false,
        message: `Supabase connection failed: ${error.message}`,
        details: error,
        timestamp,
      }
    }

    return {
      success: true,
      message: "Supabase connection successful",
      timestamp,
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
      timestamp,
    }
  }
}

export async function testSupabaseAuth(): Promise<ConnectionTestResult> {
  const timestamp = new Date().toISOString()

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return {
        success: false,
        message: "Supabase credentials not configured",
        timestamp,
      }
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    })

    const { data, error } = await supabase.auth.getSession()

    if (error) {
      return {
        success: false,
        message: `Auth test failed: ${error.message}`,
        details: error,
        timestamp,
      }
    }

    return {
      success: true,
      message: "Supabase auth accessible",
      details: { hasSession: !!data.session },
      timestamp,
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
      timestamp,
    }
  }
}

export async function testSupabaseStorage(): Promise<ConnectionTestResult> {
  const timestamp = new Date().toISOString()

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return {
        success: false,
        message: "Supabase credentials not configured",
        timestamp,
      }
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    })

    const { data, error } = await supabase.storage.listBuckets()

    if (error) {
      return {
        success: false,
        message: `Storage test failed: ${error.message}`,
        details: error,
        timestamp,
      }
    }

    return {
      success: true,
      message: "Supabase storage accessible",
      details: { bucketsCount: data?.length || 0 },
      timestamp,
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
      timestamp,
    }
  }
}

export async function comprehensiveSupabaseTest(): Promise<{
  overall: boolean
  tests: {
    connection: ConnectionTestResult
    auth: ConnectionTestResult
    storage: ConnectionTestResult
  }
}> {
  const connection = await testSupabaseConnection()
  const auth = await testSupabaseAuth()
  const storage = await testSupabaseStorage()

  return {
    overall: connection.success && auth.success && storage.success,
    tests: {
      connection,
      auth,
      storage,
    },
  }
}
