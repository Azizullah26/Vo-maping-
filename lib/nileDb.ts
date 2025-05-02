import { neon } from "@neondatabase/serverless"

// SQL client using neon
let sql: ReturnType<typeof neon> | null = null

export async function getPool() {
  if (!sql) {
    try {
      // Check if NILEDB_URL is available
      if (!process.env.NILEDB_URL) {
        console.log("NILEDB_URL environment variable is not set")
        return null
      }

      console.log("Creating database connection...")
      sql = neon(process.env.NILEDB_URL)

      // Test the connection
      console.log("Testing database connection...")
      await sql`SELECT NOW()`
      console.log("Successfully connected to Nile Postgres database")

      return sql
    } catch (error) {
      console.error("Error connecting to Nile Postgres database:", error)
      // Reset on error
      sql = null
      throw error
    }
  }

  return sql
}

// Check if the Nile database is configured
export async function isNileDatabaseConfigured() {
  try {
    // Check if NILEDB_URL is available
    if (!process.env.NILEDB_URL) {
      console.log("NILEDB_URL environment variable is not set")
      return {
        success: false,
        message: "NILEDB_URL environment variable is not set",
      }
    }

    console.log("Attempting to get database connection...")

    // Try to get a connection - this will test the connection
    try {
      const sql = await getPool()

      if (!sql) {
        console.log("Failed to create database connection")
        return {
          success: false,
          message: "Failed to create database connection",
        }
      }

      console.log("Database connection created successfully")
      return { success: true }
    } catch (poolError) {
      console.error("Error getting database connection:", poolError)
      return {
        success: false,
        message: poolError instanceof Error ? poolError.message : "Unknown database error",
        error: poolError instanceof Error ? poolError.stack : null,
      }
    }
  } catch (error) {
    console.error("Error checking Nile database configuration:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown database error",
      error: error instanceof Error ? error.stack : null,
    }
  }
}

// Initialize the documents table in Nile
export async function initializeNileDatabase() {
  try {
    const sql = await getPool()

    // If sql is null, database is not configured
    if (!sql) {
      return {
        success: false,
        message: "NILEDB_URL environment variable is not set",
      }
    }

    try {
      // Create documents table if it doesn't exist
      await sql`
        CREATE TABLE IF NOT EXISTS documents (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          type VARCHAR(50),
          size BIGINT,
          file_path TEXT NOT NULL,
          project_id VARCHAR(255) NOT NULL,
          project_name VARCHAR(255) NOT NULL,
          document_type VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `

      return { success: true }
    } catch (error) {
      console.error("Error initializing Nile database:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown database error",
      }
    }
  } catch (error) {
    console.error("Error getting connection for Nile database:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown database error",
    }
  }
}

// Get all documents from the Nile database
export async function getAllDocuments() {
  try {
    const sql = await getPool()

    // If sql is null, database is not configured
    if (!sql) {
      return {
        success: false,
        message: "NILEDB_URL environment variable is not set",
      }
    }

    try {
      const result = await sql`
        SELECT * FROM documents
        ORDER BY created_at DESC
      `

      return { success: true, data: result }
    } catch (error) {
      console.error("Error getting documents from Nile:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown database error",
      }
    }
  } catch (error) {
    console.error("Error getting connection for Nile database:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown database error",
    }
  }
}

// Get documents for a specific project from Nile
export async function getProjectDocuments(projectId: string) {
  try {
    const sql = await getPool()

    // If sql is null, database is not configured
    if (!sql) {
      return {
        success: false,
        message: "NILEDB_URL environment variable is not set",
      }
    }

    try {
      const result = await sql`
        SELECT * FROM documents
        WHERE project_id = ${projectId}
        ORDER BY created_at DESC
      `

      return { success: true, data: result }
    } catch (error) {
      console.error("Error getting project documents from Nile:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown database error",
      }
    }
  } catch (error) {
    console.error("Error getting connection for Nile database:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown database error",
    }
  }
}

// Insert a document into the Nile database
export async function insertDocument(document: {
  name: string
  type: string
  size: number
  file_path: string
  project_id: string
  project_name: string
  document_type: string
}) {
  try {
    const sql = await getPool()

    // If sql is null, database is not configured
    if (!sql) {
      return {
        success: false,
        message: "NILEDB_URL environment variable is not set",
      }
    }

    try {
      const result = await sql`
        INSERT INTO documents (name, type, size, file_path, project_id, project_name, document_type)
        VALUES (
          ${document.name}, 
          ${document.type}, 
          ${document.size}, 
          ${document.file_path}, 
          ${document.project_id}, 
          ${document.project_name}, 
          ${document.document_type}
        )
        RETURNING id
      `

      return { success: true, data: { id: result[0].id } }
    } catch (error) {
      console.error("Error inserting document into Nile:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown database error",
      }
    }
  } catch (error) {
    console.error("Error getting connection for Nile database:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown database error",
    }
  }
}

// Delete a document from the Nile database
export async function deleteDocument(id: string) {
  try {
    const sql = await getPool()

    // If sql is null, database is not configured
    if (!sql) {
      return {
        success: false,
        message: "NILEDB_URL environment variable is not set",
      }
    }

    try {
      await sql`
        DELETE FROM documents
        WHERE id = ${id}
      `

      return { success: true }
    } catch (error) {
      console.error("Error deleting document from Nile:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown database error",
      }
    }
  } catch (error) {
    console.error("Error getting connection for Nile database:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown database error",
    }
  }
}

// Get a document by ID from the Nile database
export async function getDocumentById(id: string) {
  try {
    const sql = await getPool()

    // If sql is null, database is not configured
    if (!sql) {
      return {
        success: false,
        message: "NILEDB_URL environment variable is not set",
      }
    }

    try {
      const result = await sql`
        SELECT * FROM documents
        WHERE id = ${id}
      `

      if (result.length === 0) {
        return { success: false, message: "Document not found" }
      }

      return { success: true, data: result[0] }
    } catch (error) {
      console.error("Error getting document from Nile:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown database error",
      }
    }
  } catch (error) {
    console.error("Error getting connection for Nile database:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown database error",
    }
  }
}

// No need for closePool with neon
