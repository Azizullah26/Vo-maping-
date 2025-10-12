import { Pool } from "pg"

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

// Database connection pool
let pool: Pool | null = null

/**
 * Initialize the database connection pool
 */
export async function initializeDatabase(): Promise<boolean> {
  try {
    if (!pool) {
      const connectionString = process.env.NILEDB_POSTGRES_URL

      if (!connectionString) {
        console.error("Database connection string not found in environment variables")
        return false
      }

      pool = new Pool({
        connectionString,
        ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      })

      // Test the connection
      const client = await pool.connect()
      client.release()
      console.log("Database connection initialized successfully")
      return true
    }
    return true
  } catch (error) {
    console.error("Failed to initialize database connection:", error)
    return false
  }
}

/**
 * Check if the database connection is working
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    if (!pool) {
      await initializeDatabase()
    }

    if (pool) {
      const client = await pool.connect()
      try {
        await client.query("SELECT 1")
        return true
      } finally {
        client.release()
      }
    }
    return false
  } catch (error) {
    console.error("Database connection check failed:", error)
    return false
  }
}

/**
 * Execute a database query
 */
export async function executeQuery(query: string, params: any[] = []): Promise<any> {
  try {
    if (!pool) {
      const initialized = await initializeDatabase()
      if (!initialized) {
        throw new Error("Failed to initialize database connection")
      }
    }

    const client = await pool!.connect()
    try {
      const result = await client.query(query, params)
      return { success: true, data: result.rows }
    } finally {
      client.release()
    }
  } catch (error) {
    console.error("Query execution failed:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

/**
 * Get all documents from the database
 */
export async function getAllDocuments() {
  const dbConfigured = await checkDatabaseConnection()

  if (!dbConfigured) {
    return DEMO_DOCUMENTS
  }

  try {
    const result = await executeQuery("SELECT * FROM documents ORDER BY created_at DESC")

    if (!result.success) {
      console.error("Error fetching all documents:", result.error)
      return DEMO_DOCUMENTS
    }

    return (result.data || []).map((row: any) => ({
      id: row.id,
      title: row.title || row.name,
      description: row.description,
      url: row.url || row.file_path,
      createdAt: row.created_at,
      projectId: row.project_id,
    }))
  } catch (error) {
    console.error("Error getting all documents:", error)
    return DEMO_DOCUMENTS
  }
}

/**
 * Get documents for a specific project
 */
export async function getDocumentsByProject(projectId: string) {
  const dbConfigured = await checkDatabaseConnection()

  if (!dbConfigured) {
    return DEMO_DOCUMENTS.filter((doc) => doc.projectId === projectId)
  }

  try {
    const result = await executeQuery("SELECT * FROM documents WHERE project_id = $1 ORDER BY created_at DESC", [
      projectId,
    ])

    if (!result.success) {
      console.error("Error fetching documents by project:", result.error)
      return DEMO_DOCUMENTS.filter((doc) => doc.projectId === projectId)
    }

    return (result.data || []).map((row: any) => ({
      id: row.id,
      title: row.title || row.name,
      description: row.description,
      url: row.url || row.file_path,
      createdAt: row.created_at,
      projectId: row.project_id,
    }))
  } catch (error) {
    console.error("Error getting documents by project:", error)
    return DEMO_DOCUMENTS.filter((doc) => doc.projectId === projectId)
  }
}

/**
 * Add a new document to the database
 */
export async function addDocument(document: {
  title: string
  description: string
  url: string
  projectId?: string
}) {
  const dbConfigured = await checkDatabaseConnection()

  if (!dbConfigured) {
    console.warn("Database not configured, cannot add document")
    return { success: false, error: "Database not configured" }
  }

  try {
    const { title, description, url, projectId } = document
    const result = await executeQuery(
      "INSERT INTO documents (title, description, url, project_id, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *",
      [title, description, url, projectId || null],
    )

    if (!result.success) {
      console.error("Error adding document:", result.error)
      return { success: false, error: result.error }
    }

    return { success: true, data: result.data[0] }
  } catch (error) {
    console.error("Error adding document:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

/**
 * Delete a document from the database
 */
export async function deleteDocument(documentId: string) {
  const dbConfigured = await checkDatabaseConnection()

  if (!dbConfigured) {
    console.warn("Database not configured, cannot delete document")
    return { success: false, error: "Database not configured" }
  }

  try {
    const result = await executeQuery("DELETE FROM documents WHERE id = $1 RETURNING *", [documentId])

    if (!result.success) {
      console.error("Error deleting document:", result.error)
      return { success: false, error: result.error }
    }

    if (result.data.length === 0) {
      return { success: false, error: "Document not found" }
    }

    return { success: true, data: result.data[0] }
  } catch (error) {
    console.error("Error deleting document:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

/**
 * Check if the database is configured and accessible
 */
export async function isDatabaseConfigured(): Promise<boolean> {
  return await checkDatabaseConnection()
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
