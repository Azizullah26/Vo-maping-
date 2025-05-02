import { createClient } from "@supabase/supabase-js"
import { nileClient } from "./nile-client"

/**
 * UnifiedDbClient provides a consistent interface for database operations
 * regardless of whether we're using direct Supabase connections or the Nile REST API
 */
export class UnifiedDbClient {
  private supabaseClient: ReturnType<typeof createClient> | null = null
  private useDirectConnection = false
  private connectionInitialized = false
  private connectionError: Error | null = null

  constructor() {
    // Check if we have the necessary environment variables for direct connection
    this.useDirectConnection =
      !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !!(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
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
        // Try direct Supabase connection
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
   * Initialize direct Supabase connection
   */
  private async initializeDirectConnection(): Promise<void> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase environment variables")
    }

    this.supabaseClient = createClient(supabaseUrl, supabaseKey)

    // Test the connection
    const { error } = await this.supabaseClient.from("_test_connection").select("*").limit(1)

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "relation does not exist" which is fine for this test
      throw error
    }
  }

  /**
   * Get all documents
   */
  async getAllDocuments() {
    try {
      if (this.useDirectConnection && this.supabaseClient) {
        // Use direct Supabase connection
        const { data, error } = await this.supabaseClient
          .from("documents")
          .select("*")
          .order("created_at", { ascending: false })

        if (error) throw error
        return { success: true, data }
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
      if (this.useDirectConnection && this.supabaseClient) {
        // Use direct Supabase connection
        const { data, error } = await this.supabaseClient
          .from("documents")
          .select("*")
          .eq("project_id", projectId)
          .order("created_at", { ascending: false })

        if (error) throw error
        return { success: true, data }
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
      if (this.useDirectConnection && this.supabaseClient) {
        // Use direct Supabase connection
        const { data, error } = await this.supabaseClient.from("documents").insert([document]).select("id")

        if (error) throw error
        return { success: true, data: { id: data[0].id } }
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
      if (this.useDirectConnection && this.supabaseClient) {
        // Use direct Supabase connection
        const { error } = await this.supabaseClient.from("documents").delete().eq("id", id)

        if (error) throw error
        return { success: true }
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
    this.supabaseClient = null
    this.connectionInitialized = false
  }
}

// Create a singleton instance
export const unifiedDbClient = new UnifiedDbClient()
