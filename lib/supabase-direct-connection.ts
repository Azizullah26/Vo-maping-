import { createClient } from "@supabase/supabase-js"

export interface DirectConnectionResult {
  success: boolean
  method: string
  message: string
  details?: any
  error?: string
  timestamp: string
}

/**
 * Tests Supabase connection via REST API
 */
export async function testSupabaseConnection(): Promise<DirectConnectionResult> {
  const timestamp = new Date().toISOString()

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return {
        success: false,
        method: "HTTP",
        message: "Credentials not configured",
        error: "Missing environment variables",
        timestamp,
      }
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: "HEAD",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    })

    return {
      success: response.ok,
      method: "HTTP",
      message: response.ok ? "REST API connection successful" : "REST API connection failed",
      details: {
        status: response.status,
        statusText: response.statusText,
      },
      timestamp,
    }
  } catch (error) {
    return {
      success: false,
      method: "HTTP",
      message: "Connection test failed",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp,
    }
  }
}

/**
 * Tests direct PostgreSQL connection using Supabase client
 */
export async function testDirectPostgresConnection(): Promise<DirectConnectionResult> {
  const timestamp = new Date().toISOString()

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return {
        success: false,
        method: "PostgreSQL",
        message: "Credentials not configured",
        timestamp,
      }
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Try to execute a simple query
    const { data, error } = await supabase.from("projects").select("id").limit(1)

    return {
      success: !error,
      method: "PostgreSQL",
      message: error ? "Direct query failed" : "Direct query successful",
      details: data ? { recordCount: data.length } : undefined,
      error: error?.message,
      timestamp,
    }
  } catch (error) {
    return {
      success: false,
      method: "PostgreSQL",
      message: "Connection test failed",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp,
    }
  }
}

/**
 * Tests Supabase connection with a specific query
 */
export async function testSupabaseWithQuery(tableName = "projects"): Promise<DirectConnectionResult> {
  const timestamp = new Date().toISOString()

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return {
        success: false,
        method: "Query",
        message: "Credentials not configured",
        timestamp,
      }
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { count, error } = await supabase.from(tableName).select("*", { count: "exact", head: true })

    return {
      success: !error,
      method: "Query",
      message: error ? `Query on ${tableName} failed` : `Query on ${tableName} successful`,
      details: { table: tableName, count },
      error: error?.message,
      timestamp,
    }
  } catch (error) {
    return {
      success: false,
      method: "Query",
      message: "Query test failed",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp,
    }
  }
}

/**
 * Comprehensive connection test
 */
export async function comprehensiveConnectionTest() {
  const [http, postgres, query] = await Promise.all([
    testSupabaseConnection(),
    testDirectPostgresConnection(),
    testSupabaseWithQuery(),
  ])

  return {
    overall: http.success && postgres.success && query.success,
    tests: {
      http,
      postgres,
      query,
    },
    timestamp: new Date().toISOString(),
  }
}

/**
 * Get connection status and recommendations
 */
export async function getConnectionStatus() {
  const results = await comprehensiveConnectionTest()

  const recommendations: string[] = []

  if (!results.tests.http.success) {
    recommendations.push("Check Supabase URL and API key configuration")
  }

  if (!results.tests.postgres.success) {
    recommendations.push("Verify database permissions and table existence")
  }

  if (!results.tests.query.success) {
    recommendations.push("Ensure the projects table exists and is accessible")
  }

  return {
    ...results,
    recommendations,
  }
}
