import { getDatabaseForFeature, isDatabaseConfigured } from "./database-config"
import { getDatabaseClient } from "./db-client"

// Demo data for when database is not configured
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

/**
 * Get all documents
 */
export async function getAllDocuments() {
  // Determine which database to use for documents
  const dbType = getDatabaseForFeature("documents")

  if (!isDatabaseConfigured(dbType)) {
    console.log("No database configured for documents, returning demo data")
    return DEMO_DOCUMENTS
  }

  try {
    if (dbType === "supabase") {
      const supabase = getDatabaseClient("supabase", true)
      if (!supabase) return DEMO_DOCUMENTS

      const { data, error } = await supabase.from("documents").select("*").order("created_at", { ascending: false })

      if (error || !data || data.length === 0) {
        console.log("No documents found in Supabase, returning demo data")
        return DEMO_DOCUMENTS
      }

      return data.map((row) => ({
        id: row.id,
        title: row.title || row.name,
        description: row.description,
        url: row.url || row.file_path,
        createdAt: row.created_at,
        projectId: row.project_id,
      }))
    } else if (dbType === "neon") {
      const neon = getDatabaseClient("neon")
      if (!neon) return DEMO_DOCUMENTS

      const result = await neon`
        SELECT * FROM documents 
        ORDER BY created_at DESC
      `

      if (!result || result.length === 0) {
        console.log("No documents found in Neon, returning demo data")
        return DEMO_DOCUMENTS
      }

      return result.map((row) => ({
        id: row.id,
        title: row.title || row.name,
        description: row.description,
        url: row.url || row.file_path,
        createdAt: row.created_at,
        projectId: row.project_id,
      }))
    }

    return DEMO_DOCUMENTS
  } catch (error) {
    console.error("Error getting all documents:", error)
    return DEMO_DOCUMENTS
  }
}

/**
 * Get documents for a specific project
 */
export async function getDocumentsByProject(projectId: string) {
  // Determine which database to use for documents
  const dbType = getDatabaseForFeature("documents")

  if (!isDatabaseConfigured(dbType)) {
    console.log("No database configured for documents, returning filtered demo data")
    return DEMO_DOCUMENTS.filter((doc) => doc.projectId === projectId)
  }

  try {
    if (dbType === "supabase") {
      const supabase = getDatabaseClient("supabase", true)
      if (!supabase) return DEMO_DOCUMENTS.filter((doc) => doc.projectId === projectId)

      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false })

      if (error || !data || data.length === 0) {
        console.log("No documents found in Supabase for project, returning filtered demo data")
        return DEMO_DOCUMENTS.filter((doc) => doc.projectId === projectId)
      }

      return data.map((row) => ({
        id: row.id,
        title: row.title || row.name,
        description: row.description,
        url: row.url || row.file_path,
        createdAt: row.created_at,
        projectId: row.project_id,
      }))
    } else if (dbType === "neon") {
      const neon = getDatabaseClient("neon")
      if (!neon) return DEMO_DOCUMENTS.filter((doc) => doc.projectId === projectId)

      const result = await neon`
        SELECT * FROM documents 
        WHERE project_id = ${projectId}
        ORDER BY created_at DESC
      `

      if (!result || result.length === 0) {
        console.log("No documents found in Neon for project, returning filtered demo data")
        return DEMO_DOCUMENTS.filter((doc) => doc.projectId === projectId)
      }

      return result.map((row) => ({
        id: row.id,
        title: row.title || row.name,
        description: row.description,
        url: row.url || row.file_path,
        createdAt: row.created_at,
        projectId: row.project_id,
      }))
    }

    return DEMO_DOCUMENTS.filter((doc) => doc.projectId === projectId)
  } catch (error) {
    console.error("Error getting documents by project:", error)
    return DEMO_DOCUMENTS.filter((doc) => doc.projectId === projectId)
  }
}

/**
 * Add a new document
 */
export async function addDocument(document: {
  title: string
  description: string
  url: string
  projectId?: string
}) {
  // Determine which database to use for documents
  const dbType = getDatabaseForFeature("documents")

  if (!isDatabaseConfigured(dbType)) {
    console.warn("No database configured for documents, cannot add document")
    return { success: false, error: "Database not configured" }
  }

  try {
    const { title, description, url, projectId } = document

    if (dbType === "supabase") {
      const supabase = getDatabaseClient("supabase", true)
      if (!supabase) return { success: false, error: "Supabase client not available" }

      const { data, error } = await supabase
        .from("documents")
        .insert([
          {
            title,
            description,
            url,
            project_id: projectId || null,
            created_at: new Date().toISOString(),
          },
        ])
        .select("*")
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } else if (dbType === "neon") {
      const neon = getDatabaseClient("neon")
      if (!neon) return { success: false, error: "Neon client not available" }

      const result = await neon`
        INSERT INTO documents (title, description, url, project_id, created_at) 
        VALUES (${title}, ${description}, ${url}, ${projectId || null}, NOW()) 
        RETURNING *
      `

      if (!result || result.length === 0) {
        return { success: false, error: "Failed to insert document" }
      }

      return { success: true, data: result[0] }
    }

    return { success: false, error: "Unsupported database type" }
  } catch (error) {
    console.error("Error adding document:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

/**
 * Delete a document
 */
export async function deleteDocument(documentId: string) {
  // Determine which database to use for documents
  const dbType = getDatabaseForFeature("documents")

  if (!isDatabaseConfigured(dbType)) {
    console.warn("No database configured for documents, cannot delete document")
    return { success: false, error: "Database not configured" }
  }

  try {
    if (dbType === "supabase") {
      const supabase = getDatabaseClient("supabase", true)
      if (!supabase) return { success: false, error: "Supabase client not available" }

      const { error } = await supabase.from("documents").delete().eq("id", documentId)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } else if (dbType === "neon") {
      const neon = getDatabaseClient("neon")
      if (!neon) return { success: false, error: "Neon client not available" }

      const result = await neon`
        DELETE FROM documents 
        WHERE id = ${documentId} 
        RETURNING *
      `

      if (!result || result.length === 0) {
        return { success: false, error: "Document not found" }
      }

      return { success: true, data: result[0] }
    }

    return { success: false, error: "Unsupported database type" }
  } catch (error) {
    console.error("Error deleting document:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

/**
 * Get documents for a specific project
 */
export async function getProjectDocuments(projectId?: string) {
  if (projectId) {
    return getDocumentsByProject(projectId)
  }
  return getAllDocuments()
}
