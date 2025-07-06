import { createClient } from "@supabase/supabase-js"

// Create a singleton Supabase client
let supabaseClient: ReturnType<typeof createClient> | null = null

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
 * Execute a SQL query using Supabase RPC.
 * This assumes you have an RPC function named 'execute_sql' in Supabase that can run arbitrary SQL.
 */
export async function executeQuery<T = any>(
  query: string,
  params: any[] = [],
): Promise<{ success: boolean; data?: T; error?: string }> {
  const supabase = getSupabaseClient()

  if (!supabase) {
    return {
      success: false,
      error: "Supabase client not available. Database connection not configured.",
    }
  }

  try {
    const { data, error } = await supabase.rpc("execute_sql", {
      query_text: query,
      query_params: params,
    })

    if (error) {
      console.error("Supabase RPC query error:", error)
      return { success: false, error: error.message }
    }
    return { success: true, data: data as T }
  } catch (error) {
    console.error("Error executing query via Supabase RPC:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown database error",
    }
  }
}

/**
 * Test the database connection using Supabase.
 */
export async function testConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return { success: false, message: "Supabase client not available. Check environment variables." }
    }

    // Use a simple RPC call to test connection, assuming 'get_db_version' exists
    const { data, error } = await supabase.rpc("get_db_version")
    if (!error) {
      return { success: true, message: `Supabase connection successful: ${data}` }
    } else {
      return { success: false, message: `Supabase connection failed: ${error.message}` }
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error testing connection",
    }
  }
}

/**
 * Get all documents from Supabase.
 */
export async function getAllDocuments() {
  const supabase = getSupabaseClient()
  if (!supabase) {
    return { success: false, error: "Supabase client not available." }
  }

  const { data, error } = await supabase.from("documents").select("*").order("created_at", { ascending: false })

  if (!error) {
    return { success: true, data }
  } else {
    console.error("Error fetching all documents from Supabase:", error)
    return { success: false, error: error.message }
  }
}

/**
 * Get documents for a specific project from Supabase.
 */
export async function getProjectDocuments(projectId: string) {
  const supabase = getSupabaseClient()
  if (!supabase) {
    return { success: false, error: "Supabase client not available." }
  }

  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })

  if (!error) {
    return { success: true, data }
  } else {
    console.error("Error fetching project documents from Supabase:", error)
    return { success: false, error: error.message }
  }
}

/**
 * Insert a document into Supabase.
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
  if (!supabase) {
    return { success: false, error: "Supabase client not available." }
  }

  const { data, error } = await supabase.from("documents").insert([document]).select("id")

  if (!error) {
    return { success: true, data }
  } else {
    console.error("Error inserting document into Supabase:", error)
    return { success: false, error: error.message }
  }
}

/**
 * Delete a document from Supabase.
 */
export async function deleteDocument(id: string) {
  const supabase = getSupabaseClient()
  if (!supabase) {
    return { success: false, error: "Supabase client not available." }
  }

  const { error } = await supabase.from("documents").delete().eq("id", id)

  if (!error) {
    return { success: true }
  } else {
    console.error("Error deleting document from Supabase:", error)
    return { success: false, error: error.message }
  }
}

/**
 * Close all database connections (not strictly necessary for Supabase client, but good practice).
 */
export async function closeConnections() {
  // Supabase client manages its own connections, no explicit close needed here.
  supabaseClient = null
  console.log("Supabase client instance reset.")
}
