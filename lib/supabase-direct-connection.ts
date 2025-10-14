/**
 * Supabase Direct Connection Module
 * Provides direct PostgreSQL connection testing for Supabase
 */

export interface DirectConnectionResult {
  success: boolean
  message: string
  timestamp: string
  connectionType: "http" | "postgres" | "none"
  details?: any
}

/**
 * Tests Supabase connection via HTTP REST API
 * @returns Promise with connection test result
 */
export async function testSupabaseConnection(): Promise<DirectConnectionResult> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return {
        success: false,
        message: "Supabase credentials not configured",
        timestamp: new Date().toISOString(),
        connectionType: "none",
      }
    }

    // Test via HTTP REST API
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: "HEAD",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    })

    return {
      success: response.ok,
      message: response.ok ? "HTTP connection successful" : "HTTP connection failed",
      timestamp: new Date().toISOString(),
      connectionType: "http",
      details: {
        status: response.status,
        statusText: response.statusText,
      },
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "HTTP connection test failed",
      timestamp: new Date().toISOString(),
      connectionType: "http",
    }
  }
}

/**
 * Tests direct PostgreSQL connection to Supabase
 * @returns Promise with connection test result
 */
export async function testDirectPostgresConnection(): Promise<DirectConnectionResult> {
  try {
    // Check if we have direct PostgreSQL connection string
    const postgresUrl = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL

    if (!postgresUrl) {
      return {
        success: false,
        message: "Direct PostgreSQL connection string not configured",
        timestamp: new Date().toISOString(),
        connectionType: "none",
        details: {
          hint: "Set SUPABASE_DB_URL or DATABASE_URL environment variable for direct connection",
        },
      }
    }

    // Try to connect via pg
    try {
      const { Pool } = await import("pg")
      const pool = new Pool({
        connectionString: postgresUrl,
        ssl: { rejectUnauthorized: false },
      })

      const client = await pool.connect()
      const result = await client.query("SELECT version()")
      client.release()
      await pool.end()

      return {
        success: true,
        message: "Direct PostgreSQL connection successful",
        timestamp: new Date().toISOString(),
        connectionType: "postgres",
        details: {
          version: result.rows[0]?.version?.substring(0, 50) + "...",
        },
      }
    } catch (pgError) {
      return {
        success: false,
        message: pgError instanceof Error ? pgError.message : "PostgreSQL connection failed",
        timestamp: new Date().toISOString(),
        connectionType: "postgres",
      }
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Direct connection test failed",
      timestamp: new Date().toISOString(),
      connectionType: "postgres",
    }
  }
}

/**
 * Tests Supabase connection with query execution
 */
export async function testSupabaseWithQuery(): Promise<DirectConnectionResult> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return {
        success: false,
        message: "Supabase credentials not configured",
        timestamp: new Date().toISOString(),
        connectionType: "none",
      }
    }

    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Try a simple select query
    const { data, error } = await supabase.from("projects").select("id").limit(1)

    return {
      success: !error,
      message: error ? error.message : "Query execution successful",
      timestamp: new Date().toISOString(),
      connectionType: "http",
      details: {
        rowsReturned: data?.length || 0,
      },
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Query test failed",
      timestamp: new Date().toISOString(),
      connectionType: "http",
    }
  }
}

/**
 * Performs comprehensive connection testing
 */
export async function comprehensiveConnectionTest(): Promise<{
  overall: boolean
  http: DirectConnectionResult
  postgres: DirectConnectionResult
  query: DirectConnectionResult
}> {
  const http = await testSupabaseConnection()
  const postgres = await testDirectPostgresConnection()
  const query = await testSupabaseWithQuery()

  return {
    overall: http.success || postgres.success || query.success,
    http,
    postgres,
    query,
  }
}

/**
 * Gets connection status and recommendations
 */
export async function getConnectionStatus(): Promise<{
  configured: boolean
  recommended: "http" | "postgres" | "none"
  message: string
}> {
  const hasHttpCreds = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  const hasPostgresCreds = !!(process.env.SUPABASE_DB_URL || process.env.DATABASE_URL)

  if (hasHttpCreds && hasPostgresCreds) {
    return {
      configured: true,
      recommended: "postgres",
      message:
        "Both HTTP and direct PostgreSQL connections available. Direct PostgreSQL recommended for better performance.",
    }
  }

  if (hasHttpCreds) {
    return {
      configured: true,
      recommended: "http",
      message: "HTTP connection configured. This is suitable for most use cases.",
    }
  }

  if (hasPostgresCreds) {
    return {
      configured: true,
      recommended: "postgres",
      message: "Direct PostgreSQL connection configured.",
    }
  }

  return {
    configured: false,
    recommended: "none",
    message: "No connection configured. Please set up Supabase credentials.",
  }
}
