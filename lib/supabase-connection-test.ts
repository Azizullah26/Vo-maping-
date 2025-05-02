import { createClient } from "@supabase/supabase-js"

export interface ConnectionTestResult {
  success: boolean
  message: string
  details?: any
  timestamp: string
  environment: {
    url: boolean
    anonKey: boolean
    serviceRole?: boolean
  }
}

export async function testSupabaseConnection(): Promise<ConnectionTestResult> {
  try {
    // Check if environment variables are set
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return {
        success: false,
        message: "Missing Supabase environment variables",
        timestamp: new Date().toISOString(),
        environment: {
          url: !!supabaseUrl,
          anonKey: !!supabaseAnonKey,
        },
      }
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Test connection with a simple query
    const { data, error, status } = await supabase.from("projects").select("count", { count: "exact", head: true })

    if (error) {
      return {
        success: false,
        message: `Connection error: ${error.message}`,
        details: { error, status },
        timestamp: new Date().toISOString(),
        environment: {
          url: true,
          anonKey: true,
        },
      }
    }

    // Test service role key if available (server-side only)
    let serviceRoleTest = undefined
    if (typeof window === "undefined" && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const adminClient = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY)

        const { error: adminError } = await adminClient.from("projects").select("count", { count: "exact", head: true })

        serviceRoleTest = !adminError
      } catch (e) {
        serviceRoleTest = false
      }
    }

    return {
      success: true,
      message: "Successfully connected to Supabase",
      details: { status },
      timestamp: new Date().toISOString(),
      environment: {
        url: true,
        anonKey: true,
        serviceRole: serviceRoleTest,
      },
    }
  } catch (error) {
    return {
      success: false,
      message: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
      details: { error },
      timestamp: new Date().toISOString(),
      environment: {
        url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        anonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      },
    }
  }
}
