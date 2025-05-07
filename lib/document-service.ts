import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

export interface Document {
  id: string
  project_id: string
  project_name: string
  file_name: string
  file_url: string
  type: string
  size: number
  document_type: string
  created_at: string
  updated_at: string
}

/**
 * Get all documents
 */
export async function getAllDocuments(): Promise<Document[]> {
  try {
    const { data, error } = await supabase.from("documents").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching documents:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getAllDocuments:", error)
    return []
  }
}

/**
 * Get documents by project ID
 */
export async function getDocumentsByProject(projectId: string): Promise<Document[]> {
  try {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching documents by project:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getDocumentsByProject:", error)
    return []
  }
}

/**
 * Delete a document by ID
 */
export async function deleteDocument(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    // First get the document to find the file path
    const { data: document, error: fetchError } = await supabase.from("documents").select("*").eq("id", id).single()

    if (fetchError) {
      console.error("Error fetching document:", fetchError)
      return { success: false, error: fetchError.message }
    }

    // Delete from database
    const { error: deleteError } = await supabase.from("documents").delete().eq("id", id)

    if (deleteError) {
      console.error("Error deleting document:", deleteError)
      return { success: false, error: deleteError.message }
    }

    // If the document has a file in storage, delete it too
    if (document && document.file_path) {
      try {
        const { error: storageError } = await supabase.storage.from("documents").remove([document.file_path])

        if (storageError) {
          console.warn("Could not delete file from storage:", storageError)
          // Continue anyway as the database record is deleted
        }
      } catch (storageErr) {
        console.warn("Error when trying to delete file from storage:", storageErr)
        // Continue anyway as the database record is deleted
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in deleteDocument:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
