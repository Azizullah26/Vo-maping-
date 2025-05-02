"use server"
import { uploadToBlob, deleteFromBlob } from "@/lib/blob-client"
import { revalidatePath } from "next/cache"

// Types
export interface Document {
  id: string
  name: string
  description: string
  file_url: string
  file_type: string
  file_size: number
  project_id: string
  created_at: string
}

// Get Supabase client from our utility
import { getSupabaseAdminClient } from "@/lib/supabase-client"

// Function to get Supabase client
function getSupabaseClient() {
  return getSupabaseAdminClient()
}

// Create document table if it doesn't exist
export async function ensureDocumentTable() {
  const supabase = getSupabaseClient()

  // Using RPC to create table if it doesn't exist
  const { error } = await supabase.rpc("create_documents_table_if_not_exists")

  if (error) {
    console.error("Error creating documents table:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// Upload a document
export async function uploadDocument(
  file: File,
  projectId: string,
  description = "",
): Promise<{ success: boolean; id?: string; url?: string; error?: string }> {
  try {
    // 1. Upload file to Vercel Blob
    const uploadResult = await uploadToBlob(file, `projects/${projectId}`)

    if (!uploadResult.success || !uploadResult.url) {
      return { success: false, error: uploadResult.error || "Failed to upload file" }
    }

    // 2. Store document metadata in Supabase database
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from("documents")
      .insert([
        {
          name: file.name,
          description,
          file_url: uploadResult.url,
          file_type: file.type,
          file_size: file.size,
          project_id: projectId,
        },
      ])
      .select("id")

    if (error || !data || data.length === 0) {
      // If database insert fails, try to delete the uploaded file
      await deleteFromBlob(uploadResult.url)
      return { success: false, error: error?.message || "Failed to store document metadata" }
    }

    // Revalidate paths
    revalidatePath(`/projects/${projectId}`)
    revalidatePath("/admin/documents")

    return {
      success: true,
      id: data[0].id,
      url: uploadResult.url,
    }
  } catch (error) {
    console.error("Error in uploadDocument:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error uploading document",
    }
  }
}

// Get documents for a project
export async function getProjectDocuments(projectId: string): Promise<Document[]> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })

  if (error || !data) {
    console.error(`Failed to get documents for project ${projectId}:`, error)
    return []
  }

  return data
}

// Delete a document
export async function deleteDocument(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient()

  // First, get the document to find the file URL
  const { data: document, error: getError } = await supabase
    .from("documents")
    .select("file_url, project_id")
    .eq("id", id)
    .single()

  if (getError || !document) {
    return { success: false, error: getError?.message || "Document not found" }
  }

  const fileUrl = document.file_url
  const projectId = document.project_id

  // Delete from database
  const { error: deleteError } = await supabase.from("documents").delete().eq("id", id)

  if (deleteError) {
    return { success: false, error: deleteError.message || "Failed to delete document from database" }
  }

  // Delete from Blob storage
  const blobResult = await deleteFromBlob(fileUrl)

  if (!blobResult.success) {
    console.error("Failed to delete file from Blob storage:", blobResult.error)
    // We continue even if blob deletion fails
  }

  // Revalidate paths
  if (projectId) {
    revalidatePath(`/projects/${projectId}`)
  }
  revalidatePath("/admin/documents")

  return { success: true }
}
