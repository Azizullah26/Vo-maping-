"use server"

import { getSupabaseAdmin } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

/**
 * Server action to fetch documents
 */
export async function fetchDocuments() {
  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase.from("documents").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching documents:", error)
    throw new Error(`Failed to fetch documents: ${error.message}`)
  }

  return data
}

/**
 * Server action to create a new document
 */
export async function createDocument(formData: FormData) {
  const supabase = getSupabaseAdmin()

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const file_path = formData.get("file_path") as string
  const file_type = formData.get("file_type") as string

  if (!title || !file_path || !file_type) {
    throw new Error("Missing required fields")
  }

  const { data, error } = await supabase
    .from("documents")
    .insert([
      {
        title,
        description,
        file_path,
        file_type,
        created_at: new Date().toISOString(),
      },
    ])
    .select()

  if (error) {
    console.error("Error creating document:", error)
    throw new Error(`Failed to create document: ${error.message}`)
  }

  // Revalidate the documents page to show the new document
  revalidatePath("/documents")

  return data[0]
}
