import { Pool } from "pg"

// Create a connection pool
let pool: Pool | null = null

export async function getPool() {
  if (!pool) {
    try {
      // Check if NILEDB_URL is available
      if (!process.env.NILEDB_URL) {
        console.log("NILEDB_URL environment variable is not set")
        return null
      }

      console.log("Creating database connection pool...")

      pool = new Pool({
        connectionString: process.env.NILEDB_URL,
        ssl: {
          rejectUnauthorized: false, // Required for some cloud database providers
        },
        max: 10, // Maximum number of clients in the pool
        idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
        // Add connection timeout to prevent hanging
        connectionTimeoutMillis: 5000,
      })

      // Test the connection
      console.log("Testing database connection...")
      const client = await pool.connect()
      try {
        console.log("Connection established, running test query...")
        await client.query("SELECT NOW()")
        console.log("Successfully connected to Nile Postgres database")
      } catch (queryError) {
        console.error("Error running test query:", queryError)
        throw queryError
      } finally {
        client.release()
      }
    } catch (error) {
      console.error("Error connecting to Nile Postgres database:", error)
      // Reset pool on error
      pool = null
      throw error
    }
  }

  return pool
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

    console.log("Attempting to get database pool...")

    // Try to get a pool - this will test the connection
    try {
      const pool = await getPool()

      if (!pool) {
        console.log("Failed to create database connection pool")
        return {
          success: false,
          message: "Failed to create database connection pool",
        }
      }

      console.log("Database pool created successfully")
      return { success: true }
    } catch (poolError) {
      console.error("Error getting database pool:", poolError)
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
    const pool = await getPool()

    // If pool is null, database is not configured
    if (!pool) {
      return {
        success: false,
        message: "NILEDB_URL environment variable is not set",
      }
    }

    const client = await pool.connect()

    try {
      // Create documents table if it doesn't exist
      await client.query(`
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
      `)

      return { success: true }
    } catch (error) {
      console.error("Error initializing Nile database:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown database error",
      }
    } finally {
      client.release()
    }
  } catch (error) {
    console.error("Error getting pool for Nile database:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown database error",
    }
  }
}

// Get all documents from the Nile database
export async function getAllDocuments() {
  try {
    const pool = await getPool()

    // If pool is null, database is not configured
    if (!pool) {
      return {
        success: false,
        message: "NILEDB_URL environment variable is not set",
      }
    }

    const client = await pool.connect()

    try {
      const result = await client.query(`
        SELECT * FROM documents
        ORDER BY created_at DESC
      `)

      return { success: true, data: result.rows }
    } catch (error) {
      console.error("Error getting documents from Nile:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown database error",
      }
    } finally {
      client.release()
    }
  } catch (error) {
    console.error("Error getting pool for Nile database:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown database error",
    }
  }
}

// Get documents for a specific project from Nile
export async function getProjectDocuments(projectId: string) {
  try {
    const pool = await getPool()

    // If pool is null, database is not configured
    if (!pool) {
      return {
        success: false,
        message: "NILEDB_URL environment variable is not set",
      }
    }

    const client = await pool.connect()

    try {
      const result = await client.query(
        `
        SELECT * FROM documents
        WHERE project_id = $1
        ORDER BY created_at DESC
      `,
        [projectId],
      )

      return { success: true, data: result.rows }
    } catch (error) {
      console.error("Error getting project documents from Nile:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown database error",
      }
    } finally {
      client.release()
    }
  } catch (error) {
    console.error("Error getting pool for Nile database:", error)
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
    const pool = await getPool()

    // If pool is null, database is not configured
    if (!pool) {
      return {
        success: false,
        message: "NILEDB_URL environment variable is not set",
      }
    }

    const client = await pool.connect()

    try {
      const result = await client.query(
        `
        INSERT INTO documents (name, type, size, file_path, project_id, project_name, document_type)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
      `,
        [
          document.name,
          document.type,
          document.size,
          document.file_path,
          document.project_id,
          document.project_name,
          document.document_type,
        ],
      )

      return { success: true, data: { id: result.rows[0].id } }
    } catch (error) {
      console.error("Error inserting document into Nile:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown database error",
      }
    } finally {
      client.release()
    }
  } catch (error) {
    console.error("Error getting pool for Nile database:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown database error",
    }
  }
}

// Delete a document from the Nile database
export async function deleteDocument(id: string) {
  try {
    const pool = await getPool()

    // If pool is null, database is not configured
    if (!pool) {
      return {
        success: false,
        message: "NILEDB_URL environment variable is not set",
      }
    }

    const client = await pool.connect()

    try {
      await client.query(
        `
        DELETE FROM documents
        WHERE id = $1
      `,
        [id],
      )

      return { success: true }
    } catch (error) {
      console.error("Error deleting document from Nile:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown database error",
      }
    } finally {
      client.release()
    }
  } catch (error) {
    console.error("Error getting pool for Nile database:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown database error",
    }
  }
}

// Get a document by ID from the Nile database
export async function getDocumentById(id: string) {
  try {
    const pool = await getPool()

    // If pool is null, database is not configured
    if (!pool) {
      return {
        success: false,
        message: "NILEDB_URL environment variable is not set",
      }
    }

    const client = await pool.connect()

    try {
      const result = await client.query(
        `
        SELECT * FROM documents
        WHERE id = $1
      `,
        [id],
      )

      if (result.rows.length === 0) {
        return { success: false, message: "Document not found" }
      }

      return { success: true, data: result.rows[0] }
    } catch (error) {
      console.error("Error getting document from Nile:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown database error",
      }
    } finally {
      client.release()
    }
  } catch (error) {
    console.error("Error getting pool for Nile database:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown database error",
    }
  }
}

// Close the pool when the application shuts down
export async function closePool() {
  if (pool) {
    await pool.end()
    pool = null
  }
}
