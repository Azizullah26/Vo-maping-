// Helper functions for database operations using Supabase
import { createClient } from "@supabase/supabase-js"

// Create a Supabase client
const getSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createClient(supabaseUrl, supabaseKey)
}

/**
 * Execute a SQL query directly using Supabase
 */
export async function executeSQL<T = any>(
  query: string,
  params: any[] = [],
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const supabase = getSupabaseClient()

    // Execute the query using Supabase's rpc function
    const { data, error } = await supabase.rpc("execute_sql", {
      query_text: query,
      query_params: params,
    })

    if (error) throw error

    return { success: true, data: data as T }
  } catch (error) {
    console.error("Error executing SQL query:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown database error",
    }
  }
}

/**
 * Get all documents from the database
 */
export async function getAllDocumentsSQL() {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("documents").select("*").order("created_at", { ascending: false })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

/**
 * Get documents for a specific project
 */
export async function getProjectDocumentsSQL(projectId: string) {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data }
}
