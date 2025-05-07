"\"use server"

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function getAllDocuments() {
  try {
    const { data, error } = await supabase.from("documents").select("*")

    if (error) {
      console.error("Error fetching documents:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching documents:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

async function getDocumentsByProject(projectId: string) {
  try {
    const { data, error } = await supabase.from("documents").select("*").eq("project_name", projectId)

    if (error) {
      console.error("Error fetching documents:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching documents:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export { getAllDocuments, getDocumentsByProject }
\
"
