// Use a simple fetch-based approach instead of direct database access
// This avoids native module dependencies

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
export async function getAllDocuments(): Promise<{ success: boolean; data?: Document[]; error?: string }> {
  try {
    // Use fetch API instead of direct database access
    const response = await fetch("/api/documents")

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error("Error fetching documents:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Get documents by project ID
 */
export async function getDocumentsByProject(
  projectId: string,
): Promise<{ success: boolean; data?: Document[]; error?: string }> {
  try {
    // Use fetch API instead of direct database access
    const response = await fetch(`/api/documents/project/${projectId}`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error("Error fetching documents:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Delete a document by ID
 */
export async function deleteDocument(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Use fetch API instead of direct database access
    const response = await fetch(`/api/documents/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Error deleting document:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
