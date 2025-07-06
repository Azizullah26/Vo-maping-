import type { createClient } from "@supabase/supabase-js"
import {
  getSupabaseServerClient,
  getAllDocuments as dbGetAllDocuments,
  getProjectDocuments as dbGetProjectDocuments,
  addDocument as dbAddDocument,
  deleteDocument as dbDeleteDocument,
  checkDatabaseConnection,
} from "./db"

/**
 * UnifiedDbClient provides a consistent interface for database operations
 * using only Supabase.
 */
export class UnifiedDbClient {
  private supabaseClient: ReturnType<typeof createClient> | null = null
  private connectionInitialized = false
  private connectionError: Error | null = null

  constructor() {
    // Initialize the Supabase client on construction
    this.supabaseClient = getSupabaseServerClient()
    if (!this.supabaseClient) {
      this.connectionError = new Error("Supabase client could not be initialized. Check environment variables.")
    }
  }

  /**
   * Initialize the database connection.
   */
  async initialize(): Promise<{ success: boolean; message: string }> {
    if (this.connectionInitialized) {
      return {
        success: !this.connectionError,
        message: this.connectionError ? this.connectionError.message : "Connection already initialized",
      }
    }

    if (this.connectionError) {
      return { success: false, message: this.connectionError.message }
    }

    try {
      const isConnected = await checkDatabaseConnection()
      if (!isConnected) {
        throw new Error("Supabase database connection failed during initialization.")
      }
      this.connectionInitialized = true
      return { success: true, message: "Supabase database connection established." }
    } catch (error) {
      this.connectionError = error instanceof Error ? error : new Error(String(error))
      console.error("Database connection error during initialization:", this.connectionError)
      return {
        success: false,
        message: this.connectionError.message,
      }
    }
  }

  /**
   * Get all documents.
   */
  async getAllDocuments() {
    return dbGetAllDocuments()
  }

  /**
   * Get documents for a specific project.
   */
  async getProjectDocuments(projectId: string) {
    return dbGetProjectDocuments(projectId)
  }

  /**
   * Insert a document.
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
    return dbAddDocument(document)
  }

  /**
   * Delete a document.
   */
  async deleteDocument(id: string) {
    return dbDeleteDocument(id)
  }

  /**
   * Check if the database is configured.
   */
  isConfigured(): boolean {
    return this.connectionInitialized && !this.connectionError
  }

  /**
   * Get connection status.
   */
  getStatus(): { isConfigured: boolean; message: string; usingDirectConnection: boolean } {
    return {
      isConfigured: this.isConfigured(),
      message: this.connectionError ? this.connectionError.message : "Connection is healthy",
      usingDirectConnection: true, // Always using direct Supabase connection now
    }
  }

  /**
   * Close the database connection (resets the client instance).
   */
  async close() {
    this.supabaseClient = null
    this.connectionInitialized = false
    this.connectionError = null
    console.log("UnifiedDbClient Supabase client instance reset.")
  }
}

// Create a singleton instance
export const unifiedDbClient = new UnifiedDbClient()
