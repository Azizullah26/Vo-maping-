"use server"
import { revalidatePath } from "next/cache"
import { getSupabaseAdminClient } from "@/lib/supabase-client"

// Update Document interface to match project_documents table
export interface Document {
  id: string
  project_name: string
  file_name: string
  file_url: string
  uploaded_at: string
}

// Function to get Supabase client (using admin client for server actions)
function getSupabaseClient() {
  return getSupabaseAdminClient()
}

// Create document table if it doesn't exist (now project_documents)
export async function ensureDocumentTable() {
  const supabase = getSupabaseClient()
  if (!supabase) return { success: false, error: "Supabase client not initialized" }

  // Using RPC to create table if it doesn't exist
  // This RPC function needs to be defined in Supabase if not already.
  // For now, we'll assume it executes the SQL from init-documents-table API.
  // A more direct approach would be to run the SQL here if this is the primary init point.
  // Given the user's previous `init-documents-table` API, I'll keep this as a placeholder
  // and rely on that API for actual table creation.
  const { error } = await supabase.rpc("create_project_documents_table_if_not_exists") // Assuming a new RPC for this

  if (error) {
    console.error("Error creating project_documents table:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// Upload a document
export async function uploadDocument(
  file: File,
  projectName: string, // Changed from projectId to projectName
): Promise<{ success: boolean; id?: string; url?: string; error?: string }> {
  try {
    // 1. Upload file to Vercel Blob (or Supabase Storage directly if preferred)
    // The user's plan explicitly states "Documents are stored in Supabase storage"
    // and provides a React component that uses `supabase.storage.from("project-documents").upload`.
    // So, I will modify this to use Supabase Storage directly, bypassing Vercel Blob for documents.

    const supabase = getSupabaseClient()
    if (!supabase) return { success: false, error: "Supabase client not initialized" }

    // Generate unique filename and path within the project-documents bucket
    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, "-")}`
    const filePath = `projects/${projectName}/${fileName}` // Organize by project name

    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("project-documents") // Use the specified bucket name
      .upload(filePath, buffer, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      })

    if (uploadError) {
      console.error("Error uploading file to Supabase Storage:", uploadError)
      return { success: false, error: uploadError.message || "Failed to upload file to Supabase Storage" }
    }

    const { data: publicUrlData } = supabase.storage.from("project-documents").getPublicUrl(filePath)
    if (!publicUrlData?.publicUrl) {
      return { success: false, error: "Failed to get public URL for the uploaded file" }
    }
    const fileUrl = publicUrlData.publicUrl

    // 2. Store document metadata in Supabase database (project_documents table)
    const { data, error } = await supabase
      .from("project_documents") // Use the new table name
      .insert([
        {
          project_name: projectName, // Use project_name
          file_name: file.name, // Use file.name for file_name
          file_url: fileUrl,
          uploaded_at: new Date().toISOString(), // Set uploaded_at
        },
      ])
      .select("id")

    if (error || !data || data.length === 0) {
      // If database insert fails, try to delete the uploaded file from storage
      await supabase.storage.from("project-documents").remove([filePath])
      return { success: false, error: error?.message || "Failed to store document metadata" }
    }

    // Revalidate paths (adjust as needed based on your routing)
    revalidatePath(`/al-ain/admin`) // Revalidate admin page
    revalidatePath(`/al-ain/documents`) // Revalidate general documents page
    revalidatePath(`/al-ain/admin/projects`) // Revalidate projects list

    return {
      success: true,
      id: data[0].id,
      url: fileUrl,
    }
  } catch (error) {
    console.error("Error in uploadDocument server action:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error uploading document",
    }
  }
}

// Get documents for a project
export async function getProjectDocuments(projectName: string): Promise<Document[]> {
  const supabase = getSupabaseClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from("project_documents") // Use the new table name
    .select("*")
    .eq("project_name", projectName) // Query by project_name
    .order("uploaded_at", { ascending: false }) // Order by uploaded_at

  if (error || !data) {
    console.error(`Failed to get documents for project ${projectName}:`, error)
    return []
  }

  // Map to the Document interface
  return data.map((doc) => ({
    id: doc.id,
    project_name: doc.project_name,
    file_name: doc.file_name,
    file_url: doc.file_url,
    uploaded_at: doc.uploaded_at,
  }))
}

// Delete a document
export async function deleteDocument(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient()
  if (!supabase) return { success: false, error: "Supabase client not initialized" }

  // First, get the document to find the file URL and project_name
  const { data: document, error: getError } = await supabase
    .from("project_documents") // Use the new table name
    .select("file_url, project_name")
    .eq("id", id)
    .single()

  if (getError || !document) {
    return { success: false, error: getError?.message || "Document not found" }
  }

  const fileUrl = document.file_url
  const projectName = document.project_name

  // Delete from database
  const { error: deleteError } = await supabase.from("project_documents").delete().eq("id", id) // Use the new table name

  if (deleteError) {
    return { success: false, error: deleteError.message || "Failed to delete document from database" }
  }

  // Extract file path from URL for Supabase Storage deletion
  let filePathToDelete: string | null = null
  try {
    const url = new URL(fileUrl)
    // Assuming the path is like /storage/v1/object/public/project-documents/projects/{projectName}/{fileName}
    // We need to extract projects/{projectName}/{fileName}
    const pathSegments = url.pathname.split("/")
    const bucketIndex = pathSegments.indexOf("project-documents")
    if (bucketIndex !== -1 && pathSegments.length > bucketIndex + 1) {
      filePathToDelete = pathSegments.slice(bucketIndex + 1).join("/")
    }
  } catch (e) {
    console.warn("Could not parse file URL for deletion:", fileUrl, e)
  }

  if (filePathToDelete) {
    const { error: storageError } = await supabase.storage.from("project-documents").remove([filePathToDelete])
    if (storageError) {
      console.error("Failed to delete file from Supabase storage:", storageError)
      // We continue even if storage deletion fails, as DB record is gone
    }
  } else {
    console.warn("Could not determine file path for storage deletion from URL:", fileUrl)
  }

  // Revalidate paths
  if (projectName) {
    revalidatePath(`/al-ain/admin`)
    revalidatePath(`/al-ain/documents`)
    revalidatePath(`/al-ain/admin/projects`)
  }

  return { success: true }
}
