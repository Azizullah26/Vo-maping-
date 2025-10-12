import { Pool } from "pg"
import { nileClient } from "./nile-client"

/**
 * UnifiedDbClient provides a consistent interface for database operations
 * regardless of whether we're using direct PostgreSQL connections or the Nile REST API
 */
export class UnifiedDbClient {
  private pool: Pool | null = null
  private useDirectConnection = false
  private connectionInitialized = false
  private connectionError: Error | null = null

  constructor() {
    // Check if we have the necessary environment variables for direct connection
    this.useDirectConnection = !!process.env.NILEDB_URL
  }

  /**
   * Initialize the database connection
   */
  async initialize(): Promise<{ success: boolean; message: string }> {
    if (this.connectionInitialized) {
      return {
        success: !this.connectionError,
        message: this.connectionError ? this.connectionError.message : "Connection already initialized",
      }
    }

    try {
      if (this.useDirectConnection) {
        // Try direct PostgreSQL connection
        await this.initializeDirectConnection()
        this.connectionInitialized = true
        return { success: true, message: "Direct database connection established" }
      } else {
        // Try Nile REST API connection
        const apiCheck = await nileClient.checkHealth()
        this.connectionInitialized = apiCheck.success
        if (!apiCheck.success) {
          throw new Error(apiCheck.message)
        }
        return { success: true, message: "Nile API connection established" }
      }
    } catch (error) {
      this.connectionError = error instanceof Error ? error : new Error(String(error))
      console.error("Database connection error:", this.connectionError)
      return {
        success: false,
        message: this.connectionError.message,
      }
    }
  }

  /**
   * Initialize direct PostgreSQL connection
   */
  private async initializeDirectConnection(): Promise<void> {
    if (!process.env.NILEDB_URL) {
      throw new Error("NILEDB_URL environment variable is not set")
    }

    this.pool = new Pool({
      connectionString: process.env.NILEDB_URL,
      ssl: {
        rejectUnauthorized: false,
      },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    })

    // Test the connection
    const client = await this.pool.connect()
    try {
      await client.query("SELECT NOW()")
    } finally {
      client.release()
    }
  }

  /**
   * Get all documents
   */
  async getAllDocuments() {
    try {
      if (this.useDirectConnection && this.pool) {
        // Use direct PostgreSQL connection
        const client = await this.pool.connect()
        try {
          const result = await client.query(`
            SELECT * FROM documents
            ORDER BY created_at DESC
          `)
          return { success: true, data: result.rows }
        } finally {
          client.release()
        }
      } else {
        // Use Nile REST API
        return await nileClient.getAllDocuments()
      }
    } catch (error) {
      console.error("Error getting documents:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  /**
   * Get documents for a specific project
   */
  async getProjectDocuments(projectId: string) {
    try {
      if (this.useDirectConnection && this.pool) {
        // Use direct PostgreSQL connection
        const client = await this.pool.connect()
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
        } finally {
          client.release()
        }
      } else {
        // Use Nile REST API
        return await nileClient.getProjectDocuments(projectId)
      }
    } catch (error) {
      console.error("Error getting project documents:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  /**
   * Insert a document
   */
  async insertDocument(document: {
    name: string
    type: string
    size: number
    file_path: string
    project_id: string
    project_name: string
    document_type: string
  }) {
    try {
      if (this.useDirectConnection && this.pool) {
        // Use direct PostgreSQL connection
        const client = await this.pool.connect()
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
        } finally {
          client.release()
        }
      } else {
        // Use Nile REST API
        return await nileClient.createDocument(document)
      }
    } catch (error) {
      console.error("Error inserting document:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  /**
   * Delete a document
   */
  async deleteDocument(id: string) {
    try {
      if (this.useDirectConnection && this.pool) {
        // Use direct PostgreSQL connection
        const client = await this.pool.connect()
        try {
          await client.query(
            `
            DELETE FROM documents
            WHERE id = $1
          `,
            [id],
          )
          return { success: true }
        } finally {
          client.release()
        }
      } else {
        // Use Nile REST API
        return await nileClient.deleteDocument(id)
      }
    } catch (error) {
      console.error("Error deleting document:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  /**
   * Check if the database is configured
   */
  isConfigured(): boolean {
    return this.connectionInitialized && !this.connectionError
  }

  /**
   * Get connection status
   */
  getStatus(): { isConfigured: boolean; message: string; usingDirectConnection: boolean } {
    return {
      isConfigured: this.isConfigured(),
      message: this.connectionError ? this.connectionError.message : "Connection is healthy",
      usingDirectConnection: this.useDirectConnection,
    }
  }

  /**
   * Close the database connection
   */
  async close() {
    if (this.useDirectConnection && this.pool) {
      await this.pool.end()
      this.pool = null
    }
    this.connectionInitialized = false
  }
}

// Create a singleton instance
export const unifiedDbClient = new UnifiedDbClient()
