import { getSupabaseClient, getSupabaseAdminClient } from "./supabase-client"
import { v4 as uuidv4 } from "uuid"

// Improved error handling with detailed logging
const handleError = (error: any, operation: string) => {
  console.error(`Error in document-service.ts during ${operation}:`, error)
  const message = error instanceof Error ? error.message : "Unknown error occurred"
  return { success: false, error: message }
}

// Document service - ready for future database integration
// Currently returns static/mock data

// Update Document interface to match project_documents table
export interface Document {
  id: string
  project_id: string
  title: string
  file_url: string
  file_type: string
  created_at: string
}

// Get all documents
export async function getAllDocuments(): Promise<Document[]> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) {
    console.error("Supabase admin client not initialized in getAllDocuments")
    return []
  }

  const { data, error } = await supabase
    .from("project_documents") // Use the new table name
    .select("*")
    .order("created_at", { ascending: false }) // Order by created_at

  if (error) {
    console.error("Error fetching all documents from project_documents:", error)
    return []
  }

  // Map to the Document interface
  return data.map((doc) => ({
    id: doc.id,
    project_id: doc.project_id,
    title: doc.project_name, // Assuming project_name is the title
    file_url: doc.file_url,
    file_type: doc.file_type,
    created_at: doc.uploaded_at,
  }))
}

// Get document by ID
export async function getDocumentById(id: string) {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("project_documents").select("*").eq("id", id).single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    return handleError(error, `getDocumentById(${id})`)
  }
}

// Get documents by project ID
export async function getDocumentsByProject(projectId: string): Promise<Document[]> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from("project_documents")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    return handleError(error, `getDocumentsByProject(${projectId})`)
  }
}

// Create a new document
export async function createDocument(document: {
  title: string
  description?: string
  file_path: string
  project_id?: string
  file_type?: string
  file_size?: number
  metadata?: Record<string, any>
}) {
  try {
    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      console.error("Supabase admin client not initialized in createDocument")
      return { success: false, error: "Supabase admin client not initialized" }
    }

    const { data, error } = await supabase
      .from("project_documents")
      .insert([
        {
          id: uuidv4(),
          project_id: document.project_id || null,
          title: document.title,
          file_url: document.file_path, // Assuming file_path is the URL
          file_type: document.file_type || "unknown",
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) throw error
    return { success: true, data: data[0] }
  } catch (error) {
    return handleError(error, "createDocument")
  }
}

// Update an existing document
export async function updateDocument(
  id: string,
  updates: Partial<{
    title: string
    description: string
    file_path: string
    project_id: string
    metadata: Record<string, any>
  }>,
) {
  try {
    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      console.error("Supabase admin client not initialized in updateDocument")
      return { success: false, error: "Supabase admin client not initialized" }
    }

    const { data, error } = await supabase
      .from("project_documents")
      .update({
        ...updates,
        created_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) throw error
    return { success: true, data: data[0] }
  } catch (error) {
    return handleError(error, `updateDocument(${id})`)
  }
}

// Delete a document
export async function deleteDocument(documentId: string): Promise<boolean> {
  try {
    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      console.error("Supabase admin client not initialized in deleteDocument")
      return { success: false, error: "Supabase admin client not initialized" }
    }

    const { error } = await supabase.from("project_documents").delete().eq("id", documentId)

    if (error) throw error
    return { success: true }
  } catch (error) {
    return handleError(error, `deleteDocument(${documentId})`)
  }
}

// Search documents by title or description
export async function searchDocuments(query: string) {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from("project_documents")
      .select("*")
      .or(`title.ilike.%${query}%,file_name.ilike.%${query}%`)
      .order("created_at", { ascending: false })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    return handleError(error, `searchDocuments(${query})`)
  }
}

// Upload a file to Supabase Storage
export async function uploadFile(file: File, bucket = "documents", path = "") {
  try {
    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      console.error("Supabase admin client not initialized in uploadFile")
      return { success: false, error: "Supabase admin client not initialized" }
    }

    const filePath = path ? `${path}/${file.name}` : file.name

    const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    })

    if (error) throw error

    // Get the public URL
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path)

    return {
      success: true,
      data: {
        path: data.path,
        url: urlData.publicUrl,
        size: file.size,
        type: file.type,
      },
    }
  } catch (error) {
    return handleError(error, "uploadFile")
  }
}

// Delete a file from Supabase Storage
export async function deleteFile(path: string, bucket = "documents") {
  try {
    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      console.error("Supabase admin client not initialized in deleteFile")
      return { success: false, error: "Supabase admin client not initialized" }
    }

    const { error } = await supabase.storage.from(bucket).remove([path])

    if (error) throw error
    return { success: true }
  } catch (error) {
    return handleError(error, `deleteFile(${path})`)
  }
}

// List files in a Supabase Storage bucket/folder
export async function listFiles(bucket = "documents", path = "") {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.storage.from(bucket).list(path)

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    return handleError(error, `listFiles(${bucket}, ${path})`)
  }
}

// Check if a file exists in Supabase Storage
export async function fileExists(path: string, bucket = "documents") {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.storage.from(bucket).list(path.split("/").slice(0, -1).join("/"))

    if (error) throw error

    const fileName = path.split("/").pop()
    return {
      success: true,
      exists: data.some((file) => file.name === fileName),
    }
  } catch (error) {
    return handleError(error, `fileExists(${path})`)
  }
}
