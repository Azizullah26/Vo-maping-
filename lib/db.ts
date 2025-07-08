import { createClient } from "@supabase/supabase-js"

// Demo data for when database is not configured or fails
const DEMO_DOCUMENTS = [
  {
    id: "doc-1",
    title: "Zayed National Museum Overview",
    description: "Architectural plans and overview of the Zayed National Museum project",
    url: "/documents/zayed-museum-overview.pdf",
    createdAt: "2023-01-15T08:30:00Z",
    projectId: "zayed-museum",
  },
  {
    id: "doc-2",
    title: "Louvre Abu Dhabi Exhibition Schedule",
    description: "Upcoming exhibitions and events at the Louvre Abu Dhabi",
    url: "/documents/louvre-schedule.pdf",
    createdAt: "2023-02-20T10:15:00Z",
    projectId: "louvre-ad",
  },
  {
    id: "doc-3",
    title: "Al Ain Oasis Conservation Plan",
    description: "Detailed conservation plan for the historic Al Ain Oasis",
    url: "/documents/al-ain-oasis.pdf",
    createdAt: "2023-03-05T14:45:00Z",
    projectId: "al-ain-oasis",
  },
]

// Supabase client instance (singleton for server-side)
const supabaseServerClient: ReturnType<typeof createClient> | null = null

/**
 * Get the Supabase client for server-side operations.
 * Uses SUPABASE_SERVICE_ROLE_KEY for elevated privileges.
 */
export const getSupabaseServerClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase server environment variables")
  }

  return createClient(supabaseUrl, supabaseServiceKey)
}

/**
 * Get the Supabase client for client-side operations.
 * Uses NEXT_PUBLIC_SUPABASE_ANON_KEY for public access.
 */
export const getSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase client environment variables")
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

/**
 * Check if the Supabase database connection is configured and accessible.
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const supabase = getSupabaseServerClient()
    if (!supabase) {
      return false
    }

    // Perform a simple query to check connection (e.g., check if 'documents' table exists or count rows)
    // Using a simple select from 'documents' table. If it doesn't exist, it will throw an error.
    // For a more robust check, you might use a custom RPC function like 'get_db_version' if available.
    const { error } = await supabase.from("documents").select("id").limit(1)

    if (error && error.code !== "42P01") {
      // 42P01 is "undefined_table", which means table doesn't exist yet, but connection is fine
      console.error("Supabase connection error:", error.message)
      return false
    }

    return true
  } catch (error) {
    console.error("Database check error:", error)
    return false
  }
}

/**
 * Initialize the database (e.g., create tables if they don't exist).
 * This function assumes the necessary SQL scripts are run via Supabase migrations or initial setup.
 * For this example, we'll just check connection.
 */
export async function initializeDatabase(): Promise<{ success: boolean; message: string }> {
  const isConnected = await checkDatabaseConnection()
  if (isConnected) {
    return { success: true, message: "Supabase database is connected and ready." }
  } else {
    return {
      success: false,
      message: "Failed to connect to Supabase database. Please ensure it's configured and tables are set up.",
    }
  }
}

/**
 * Execute a generic database query using Supabase RPC.
 * This assumes you have an RPC function named 'execute_sql' in Supabase that can run arbitrary SQL.
 * If not, direct table operations should be used instead of this generic function.
 */
export async function executeQuery(
  query: string,
  params: any[] = [],
): Promise<{ success: boolean; data?: any; error?: string }> {
  const supabase = getSupabaseServerClient()
  if (!supabase) {
    return { success: false, error: "Supabase client not initialized." }
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
    return { success: true, data }
  } catch (error) {
    console.error("Error executing Supabase RPC query:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

/**
 * Get all documents from the database.
 */
export async function getAllDocuments(): Promise<any[]> {
  const dbConfigured = await checkDatabaseConnection()

  if (!dbConfigured) {
    console.warn("Database not configured, returning demo data for getAllDocuments.")
    return DEMO_DOCUMENTS
  }

  try {
    const supabase = getSupabaseServerClient()
    if (!supabase) {
      throw new Error("Supabase client not initialized.")
    }

    const { data, error } = await supabase.from("documents").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching all documents from Supabase:", error)
      return DEMO_DOCUMENTS // Fallback to demo data on error
    }

    if (!data || data.length === 0) {
      console.log("No documents found in Supabase, returning demo data.")
      return DEMO_DOCUMENTS
    }

    return data.map((row: any) => ({
      id: row.id,
      title: row.title || row.name,
      description: row.description,
      url: row.url || row.file_path,
      createdAt: row.created_at,
      projectId: row.project_id,
    }))
  } catch (error) {
    console.error("Error in getAllDocuments:", error)
    return DEMO_DOCUMENTS
  }
}

/**
 * Get documents for a specific project.
 */
export async function getDocumentsByProject(projectId: string): Promise<any[]> {
  const dbConfigured = await checkDatabaseConnection()

  if (!dbConfigured) {
    console.warn("Database not configured, returning demo data for getDocumentsByProject.")
    return DEMO_DOCUMENTS.filter((doc) => doc.projectId === projectId)
  }

  try {
    const supabase = getSupabaseServerClient()
    if (!supabase) {
      throw new Error("Supabase client not initialized.")
    }

    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching documents by project from Supabase:", error)
      return DEMO_DOCUMENTS.filter((doc) => doc.projectId === projectId) // Fallback to demo data on error
    }

    if (!data || data.length === 0) {
      console.log("No documents found for project in Supabase, returning demo data.")
      return DEMO_DOCUMENTS.filter((doc) => doc.projectId === projectId)
    }

    return data.map((row: any) => ({
      id: row.id,
      title: row.title || row.name,
      description: row.description,
      url: row.url || row.file_path,
      createdAt: row.created_at,
      projectId: row.project_id,
    }))
  } catch (error) {
    console.error("Error in getDocumentsByProject:", error)
    return DEMO_DOCUMENTS.filter((doc) => doc.projectId === projectId)
  }
}

/**
 * Add a new document to the database.
 */
export async function addDocument(document: {
  name: string
  type: string
  size: number
  file_path: string
  project_id: string
  project_name: string
  document_type: string
}): Promise<{ success: boolean; data?: any; error?: string }> {
  const dbConfigured = await checkDatabaseConnection()

  if (!dbConfigured) {
    console.warn("Database not configured, cannot add document.")
    return { success: false, error: "Database not configured" }
  }

  try {
    const supabase = getSupabaseServerClient()
    if (!supabase) {
      throw new Error("Supabase client not initialized.")
    }

    const { data, error } = await supabase
      .from("documents")
      .insert([
        {
          name: document.name,
          type: document.type,
          size: document.size,
          file_path: document.file_path,
          project_id: document.project_id,
          project_name: document.project_name,
          document_type: document.document_type,
        },
      ])
      .select("id, name, file_path") // Select relevant fields to return

    if (error) {
      console.error("Error adding document to Supabase:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data: data[0] }
  } catch (error) {
    console.error("Error in addDocument:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

/**
 * Delete a document from the database.
 */
export async function deleteDocument(documentId: string): Promise<{ success: boolean; data?: any; error?: string }> {
  const dbConfigured = await checkDatabaseConnection()

  if (!dbConfigured) {
    console.warn("Database not configured, cannot delete document.")
    return { success: false, error: "Database not configured" }
  }

  try {
    const supabase = getSupabaseServerClient()
    if (!supabase) {
      throw new Error("Supabase client not initialized.")
    }

    const { data, error } = await supabase.from("documents").delete().eq("id", documentId).select("id") // Select ID to confirm deletion

    if (error) {
      console.error("Error deleting document from Supabase:", error)
      return { success: false, error: error.message }
    }

    if (!data || data.length === 0) {
      return { success: false, error: "Document not found or already deleted." }
    }

    return { success: true, data: data[0], message: "Document deleted successfully." }
  } catch (error) {
    console.error("Error in deleteDocument:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

/**
 * Get documents for a specific project (alias for getDocumentsByProject).
 */
export async function getProjectDocuments(projectId?: string): Promise<any[]> {
  if (projectId) {
    return getDocumentsByProject(projectId)
  }
  return getAllDocuments()
}
