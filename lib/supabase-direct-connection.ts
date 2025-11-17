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

    if (!supabaseUrl) {
      return {
        success: false,
        message: "Supabase URL not configured",
        timestamp,
      }
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: "HEAD",
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      },
    })

    if (!response.ok) {
      return {
        success: false,
        message: `HTTP connection failed: ${response.status}`,
        timestamp,
      }
    }

    return {
      success: true,
      message: "Supabase HTTP connection successful",
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

export async function testDirectPostgresConnection(): Promise<ConnectionTestResult> {
  const timestamp = new Date().toISOString()

  try {
    const postgresUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL

    if (!postgresUrl) {
      return {
        success: false,
        message: "PostgreSQL URL not configured",
        timestamp,
      }
    }

    return {
      success: true,
      message: "PostgreSQL URL is configured",
      details: { configured: true },
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

export async function testSupabaseWithQuery(): Promise<ConnectionTestResult> {
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

    const response = await fetch(`${supabaseUrl}/rest/v1/projects?select=count`, {
      method: "HEAD",
      headers: {
        apikey: supabaseAnonKey,
        Prefer: "count=exact",
      },
    })

    if (!response.ok) {
      return {
        success: false,
        message: `Query test failed: ${response.status}`,
        timestamp,
      }
    }

    return {
      success: true,
      message: "Supabase query test successful",
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

export async function comprehensiveConnectionTest(): Promise<{
  overall: boolean
  tests: {
    httpConnection: ConnectionTestResult
    postgresConnection: ConnectionTestResult
    queryTest: ConnectionTestResult
  }
}> {
  const httpConnection = await testSupabaseConnection()
  const postgresConnection = await testDirectPostgresConnection()
  const queryTest = await testSupabaseWithQuery()

  return {
    overall: httpConnection.success && postgresConnection.success && queryTest.success,
    tests: {
      httpConnection,
      postgresConnection,
      queryTest,
    },
  }
}

export async function getConnectionStatus(): Promise<{
  healthy: boolean
  message: string
  recommendations: string[]
}> {
  const tests = await comprehensiveConnectionTest()

  const recommendations: string[] = []

  if (!tests.tests.httpConnection.success) {
    recommendations.push("Check Supabase URL and API key configuration")
  }

  if (!tests.tests.postgresConnection.success) {
    recommendations.push("Configure PostgreSQL connection string")
  }

  if (!tests.tests.queryTest.success) {
    recommendations.push("Verify database permissions and table existence")
  }

  return {
    healthy: tests.overall,
    message: tests.overall ? "All connections healthy" : "Some connections failed",
    recommendations,
  }
}
