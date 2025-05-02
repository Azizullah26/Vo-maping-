import { createClient } from "@supabase/supabase-js"
import type { Pool } from "pg"

export interface ConnectionTestResult {
  success: boolean
  message: string
  details?: any
  timestamp: string
  documents?: any[]
}

// Test connection using environment variables
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
      }
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Test connection with a simple query
    const { data: documents, error } = await supabase.from("documents").select("*").limit(10)

    if (error) {
      return {
        success: false,
        message: `Connection error: ${error.message}`,
        details: { error },
        timestamp: new Date().toISOString(),
      }
    }

    return {
      success: true,
      message: "Successfully connected to Supabase",
      documents,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    return {
      success: false,
      message: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
      details: { error },
      timestamp: new Date().toISOString(),
    }
  }
}

// Test direct PostgreSQL connection (server-side only)
export async function testDirectPostgresConnection(): Promise<ConnectionTestResult> {
  if (typeof window !== "undefined") {
    return {
      success: false,
      message: "Direct PostgreSQL connection can only be tested server-side",
      timestamp: new Date().toISOString(),
    }
  }

  let pool: Pool | null = null

  try {
    // Use the direct connection parameters
    const { Pool } = require("pg")

    pool = new Pool({
      host: "aws-0-us-east-1.pooler.supabase.com",
      port: 6543,
      database: "postgres",
      user: "postgres.pbqfgjzvclwgxgvuzmul",
      password: process.env.SUPABASE_POSTGRES_PASSWORD, // Use from environment variable for security
      ssl: {
        rejectUnauthorized: false, // Required for some Supabase connections
      },
    })

    // Test the connection
    const client = await pool.connect()

    try {
      // Query the documents table
      const result = await client.query("SELECT * FROM documents LIMIT 10")

      return {
        success: true,
        message: "Successfully connected directly to PostgreSQL",
        documents: result.rows,
        timestamp: new Date().toISOString(),
      }
    } finally {
      client.release()
    }
  } catch (error) {
    return {
      success: false,
      message: `Direct PostgreSQL connection error: ${error instanceof Error ? error.message : String(error)}`,
      details: { error },
      timestamp: new Date().toISOString(),
    }
  } finally {
    if (pool) {
      await pool.end()
    }
  }
}
