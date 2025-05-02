import { createClient } from "@supabase/supabase-js"
import { Pool } from "pg"

// Create a singleton Supabase client
let supabaseClient: ReturnType<typeof createClient> | null = null
let pgPool: Pool | null = null

/**
 * Get a Supabase client for database operations
 */
export function getSupabaseClient() {
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error("No Supabase credentials found in environment variables")
      return null
    }

    try {
      supabaseClient = createClient(supabaseUrl, supabaseKey)
      console.log("Supabase client created successfully")
    } catch (error) {
      console.error("Error creating Supabase client:", error)
      return null
    }
  }

  return supabaseClient
}

/**
 * Get a direct PostgreSQL connection pool
 * This is used as a fallback if Supabase RPC methods aren't available
 */
export function getPgPool() {
  if (!pgPool) {
    const connectionString = process.env.DATABASE_URL

    if (!connectionString) {
      console.error("No DATABASE_URL found in environment variables")
      return null
    }

    try {
      pgPool = new Pool({
        connectionString,
        ssl: {
          rejectUnauthorized: false,
        },
      })
      console.log("PostgreSQL pool created successfully")
    } catch (error) {
      console.error("Error creating PostgreSQL pool:", error)
      return null
    }
  }

  return pgPool
}

/**
 * Execute a SQL query
 */
export async function executeQuery<T = any>(
  query: string,
  params: any[] = [],
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    // First try using Supabase RPC
    const supabase = getSupabaseClient()

    if (supabase) {
      try {
        const { data, error } = await supabase.rpc("execute_sql", {
          query_text: query,
          query_params: params,
        })

        if (!error) {
          return { success: true, data: data as T }
        }
        // If RPC fails (e.g., function doesn't exist), fall back to direct connection
        console.log("Supabase RPC failed, falling back to direct connection:", error.message)
      } catch (rpcError) {
        console.log("Supabase RPC error, falling back to direct connection:", rpcError)
      }
    }

    // Fall back to direct PostgreSQL connection
    const pool = getPgPool()
    if (!pool) {
      return {
        success: false,
        error: "Database connection not available",
      }
    }

    const result = await pool.query(query, params)
    return { success: true, data: result.rows as T }
  } catch (error) {
    console.error("Error executing query:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown database error",
    }
  }
}

/**
 * Test the database connection
 */
export async function testConnection(): Promise<{ success: boolean; message: string }> {
  try {
    // First try Supabase
    const supabase = getSupabaseClient()
    if (supabase) {
      try {
        const { data, error } = await supabase.rpc("get_db_version")
        if (!error) {
          return { success: true, message: `Supabase connection successful: ${data}` }
        }
      } catch (e) {
        console.log("Supabase connection test failed, trying direct connection")
      }
    }

    // Fall back to direct connection
    const result = await executeQuery("SELECT version() as version")

    if (result.success && result.data) {
      return {
        success: true,
        message: `Direct PostgreSQL connection successful: ${result.data[0]?.version || "Unknown version"}`,
      }
    } else {
      return { success: false, message: result.error || "Unknown error" }
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error testing connection",
    }
  }
}

/**
 * Get all documents
 */
export async function getAllDocuments() {
  const supabase = getSupabaseClient()
  if (supabase) {
    const { data, error } = await supabase.from("documents").select("*").order("created_at", { ascending: false })

    if (!error) {
      return { success: true, data }
    }
  }

  // Fall back to direct query
  return executeQuery(`
    SELECT * FROM documents
    ORDER BY created_at DESC
  `)
}

/**
 * Get documents for a specific project
 */
export async function getProjectDocuments(projectId: string) {
  const supabase = getSupabaseClient()
  if (supabase) {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false })

    if (!error) {
      return { success: true, data }
    }
  }

  // Fall back to direct query
  return executeQuery(
    `SELECT * FROM documents
     WHERE project_id = $1
     ORDER BY created_at DESC`,
    [projectId],
  )
}

/**
 * Insert a document
 */
export async function insertDocument(document: {
  name: string
  type: string
  size: number
  file_path: string
  project_id: string
  project_name: string
  document_type: string
}) {
  const supabase = getSupabaseClient()
  if (supabase) {
    const { data, error } = await supabase.from("documents").insert([document]).select("id")

    if (!error) {
      return { success: true, data }
    }
  }

  // Fall back to direct query
  return executeQuery(
    `INSERT INTO documents (name, type, size, file_path, project_id, project_name, document_type)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id`,
    [
      document.name,
      document.type,
      document.size,
      document.file_path,
      document.project_id,
      document.project_name,
      document.document_type,
    ],
  )
}

/**
 * Delete a document
 */
export async function deleteDocument(id: string) {
  const supabase = getSupabaseClient()
  if (supabase) {
    const { error } = await supabase.from("documents").delete().eq("id", id)

    if (!error) {
      return { success: true }
    }
  }

  // Fall back to direct query
  return executeQuery(
    `DELETE FROM documents
     WHERE id = $1`,
    [id],
  )
}

/**
 * Close all database connections
 */
export async function closeConnections() {
  if (pgPool) {
    await pgPool.end()
    pgPool = null
  }
  supabaseClient = null
}
