// Import dynamically to avoid build-time issues
let neon: any = null

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

// Dynamically import neon to avoid build-time issues
async function getNeon() {
  if (!neon) {
    try {
      const module = await import("@neondatabase/serverless")
      neon = module.neon
    } catch (error) {
      console.error("Failed to import neon:", error)
      return null
    }
  }
  return neon
}

// SQL client using neon
let sql: ReturnType<typeof neon> | null = null

/**
 * Initialize the database connection
 */
export async function initializeDatabase(): Promise<boolean> {
  try {
    if (!sql) {
      const connectionString = process.env.POSTGRES_URL || process.env.NILEDB_POSTGRES_URL

      if (!connectionString) {
        console.error("Database connection string not found in environment variables")
        return false
      }

      const neonFn = await getNeon()
      if (!neonFn) {
        console.error("Failed to load neon database driver")
        return false
      }

      sql = neonFn(connectionString)

      // Test the connection
      await sql`SELECT 1`
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
    if (!sql) {
      await initializeDatabase()
    }

    if (sql) {
      await sql`SELECT 1`
      return true
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
    if (!sql) {
      const initialized = await initializeDatabase()
      if (!initialized) {
        throw new Error("Failed to initialize database connection")
      }
    }

    // For parameterized queries, we need to use the tagged template literal syntax
    // This is a simplified approach - for complex queries, you might need to build the query differently
    const result = await sql(query, params)
    return { success: true, data: result }
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
    const result = await sql`SELECT * FROM documents ORDER BY created_at DESC`

    if (!result || result.length === 0) {
      console.log("No documents found, returning demo data")
      return DEMO_DOCUMENTS
    }

    return result.map((row: any) => ({
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
    const result = await sql`
      SELECT * FROM documents 
      WHERE project_id = ${projectId} 
      ORDER BY created_at DESC
    `

    if (!result || result.length === 0) {
      return DEMO_DOCUMENTS.filter((doc) => doc.projectId === projectId)
    }

    return result.map((row: any) => ({
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
    const result = await sql`
      INSERT INTO documents (title, description, url, project_id, created_at) 
      VALUES (${title}, ${description}, ${url}, ${projectId || null}, NOW()) 
      RETURNING *
    `

    return { success: true, data: result[0] }
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
    const result = await sql`
      DELETE FROM documents 
      WHERE id = ${documentId} 
      RETURNING *
    `

    if (!result || result.length === 0) {
      return { success: false, error: "Document not found" }
    }

    return { success: true, data: result[0] }
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
