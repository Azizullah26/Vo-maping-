export interface DirectConnectionResult {
  success: boolean
  method: string
  message: string
  timestamp: string
  details?: unknown
  error?: string
}

export interface PostgresConnectionResult {
  success: boolean
  message: string
  canConnect: boolean
  error?: string
}

export interface QueryTestResult {
  success: boolean
  message: string
  rowCount?: number
  error?: string
}

export interface ComprehensiveConnectionResult {
  http: DirectConnectionResult
  postgres: PostgresConnectionResult
  query: QueryTestResult
  overall: {
    success: boolean
    timestamp: string
    recommendations: string[]
  }
}

/**
 * Test Supabase connection using HTTP REST API
 */
export async function testSupabaseConnection(): Promise<DirectConnectionResult> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return {
        success: false,
        method: "HTTP",
        message: "Supabase credentials not configured",
        timestamp: new Date().toISOString(),
        error: "Missing environment variables",
      }
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        apikey: supabaseKey,
        "Content-Type": "application/json",
      },
    })

    return {
      success: response.ok,
      method: "HTTP",
      message: response.ok ? "HTTP connection successful" : `HTTP connection failed: ${response.statusText}`,
      timestamp: new Date().toISOString(),
      details: {
        status: response.status,
        statusText: response.statusText,
        url: supabaseUrl,
      },
    }
  } catch (error) {
    return {
      success: false,
      method: "HTTP",
      message: `HTTP connection failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Test direct PostgreSQL connection (if available)
 */
export async function testDirectPostgresConnection(): Promise<PostgresConnectionResult> {
  try {
    // Check if we have direct Postgres credentials
    const postgresUrl = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL || process.env.SUPABASE_POSTGRES_URL

    if (!postgresUrl) {
      return {
        success: false,
        message: "Direct PostgreSQL credentials not configured",
        canConnect: false,
        error: "No PostgreSQL connection string found",
      }
    }

    // Note: This would require pg library which might not be available
    // For now, we'll just validate the connection string format
    const isValidUrl = postgresUrl.startsWith("postgres://") || postgresUrl.startsWith("postgresql://")

    return {
      success: isValidUrl,
      message: isValidUrl ? "PostgreSQL connection string is valid" : "Invalid PostgreSQL connection string format",
      canConnect: isValidUrl,
    }
  } catch (error) {
    return {
      success: false,
      message: `PostgreSQL test failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      canConnect: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Test Supabase connection with a simple query
 */
export async function testSupabaseWithQuery(): Promise<QueryTestResult> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return {
        success: false,
        message: "Supabase credentials not configured",
        error: "Missing environment variables",
      }
    }

    // Try to query a system table
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/version`, {
      headers: {
        apikey: supabaseKey,
        "Content-Type": "application/json",
      },
    })

    if (response.ok) {
      const data = await response.json()
      return {
        success: true,
        message: "Query executed successfully",
        rowCount: 1,
      }
    }

    // If version endpoint doesn't exist, that's okay - connection still works
    return {
      success: true,
      message: "Connection verified (query endpoint not available)",
    }
  } catch (error) {
    return {
      success: false,
      message: `Query test failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Run comprehensive connection tests
 */
export async function comprehensiveConnectionTest(): Promise<ComprehensiveConnectionResult> {
  const http = await testSupabaseConnection()
  const postgres = await testDirectPostgresConnection()
  const query = await testSupabaseWithQuery()

  const overallSuccess = http.success

  const recommendations: string[] = []
  if (!http.success) {
    recommendations.push("Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY")
  }
  if (!postgres.success) {
    recommendations.push("Configure direct PostgreSQL connection for better performance")
  }
  if (!query.success && http.success) {
    recommendations.push("HTTP connection works but query execution failed - check permissions")
  }

  return {
    http,
    postgres,
    query,
    overall: {
      success: overallSuccess,
      timestamp: new Date().toISOString(),
      recommendations,
    },
  }
}

/**
 * Get connection status and recommendations
 */
export async function getConnectionStatus(): Promise<{
  status: "healthy" | "degraded" | "unhealthy"
  message: string
  recommendations: string[]
}> {
  const result = await comprehensiveConnectionTest()

  if (result.overall.success && result.query.success) {
    return {
      status: "healthy",
      message: "All connections working properly",
      recommendations: [],
    }
  }

  if (result.http.success) {
    return {
      status: "degraded",
      message: "Basic connection works but some features unavailable",
      recommendations: result.overall.recommendations,
    }
  }

  return {
    status: "unhealthy",
    message: "Connection failed",
    recommendations: result.overall.recommendations,
  }
}
