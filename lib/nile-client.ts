import { Pool } from "pg"

// Nile API configuration
const NILE_API_URL = process.env.NILEDB_API_URL || "https://api.thenile.dev"
const NILE_API_TOKEN = process.env.NILEDB_API_TOKEN
const NILE_DATABASE_ID = process.env.NILEDB_DATABASE_ID || "0194e938-6835-709a-88b7-939874e020f7"
const NILE_WORKSPACE_ID = process.env.NILEDB_WORKSPACE_ID || "0194e937-c587-7a9e-865b-ee1c66fefed3"

const pool = new Pool({
  connectionString: process.env.NILEDB_POSTGRES_URL,
  ssl: process.env.VERCEL_ENV === "production" ? { rejectUnauthorized: false } : false,
})

/**
 * Nile API client for interacting with Nile database
 */
export class NileClient {
  private apiUrl: string
  private token: string
  private databaseId: string
  private workspaceId: string

  constructor() {
    this.apiUrl = NILE_API_URL
    this.token = NILE_API_TOKEN || ""
    this.databaseId = NILE_DATABASE_ID
    this.workspaceId = NILE_WORKSPACE_ID

    if (!this.token) {
      console.warn("NILEDB_API_TOKEN is not set. Nile API requests will fail.")
    }
  }

  /**
   * Make an authenticated request to the Nile API
   */
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      // Construct the full URL with the workspace and database IDs
      // Make sure the endpoint doesn't start with a slash to avoid double slashes
      const cleanEndpoint = endpoint.startsWith("/") ? endpoint.substring(1) : endpoint

      // Format: {apiUrl}/v2/databases/{databaseId}/{endpoint}
      // FIX: Remove the duplicated path segments
      const url = `${this.apiUrl}/v2/databases/${this.databaseId}/${cleanEndpoint}`

      // Add authorization header with the token
      const headers = {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
        ...options.headers,
      }

      console.log(`Making Nile API request to: ${url}`)

      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Nile API error (${response.status}): ${errorText}`)
        throw new Error(`Nile API request failed: ${response.status} ${response.statusText}`)
      }

      return (await response.json()) as T
    } catch (error) {
      console.error("Nile API request error:", error)
      throw error
    }
  }

  /**
   * Check if the Nile API is accessible with the current token
   */
  async checkHealth(): Promise<{ success: boolean; message: string }> {
    try {
      // Try to access a basic endpoint to verify the token works
      // Use a simple endpoint that should always exist
      const result = await this.request("tables")
      return {
        success: true,
        message: "Nile API connection successful",
        databaseId: this.databaseId,
        workspaceId: this.workspaceId,
        data: result,
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error connecting to Nile API",
        databaseId: this.databaseId,
        workspaceId: this.workspaceId,
      }
    }
  }

  /**
   * Get all documents from the documents table
   */
  async getAllDocuments() {
    try {
      const result = await this.request("tables/documents/rows")
      return { success: true, data: result }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch documents",
      }
    }
  }

  /**
   * Get a document by ID
   */
  async getDocumentById(id: string) {
    try {
      const result = await this.request(`tables/documents/rows/${id}`)
      return { success: true, data: result }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : `Failed to fetch document ${id}`,
      }
    }
  }

  /**
   * Create a new document
   */
  async createDocument(document: any) {
    try {
      const result = await this.request("tables/documents/rows", {
        method: "POST",
        body: JSON.stringify(document),
      })
      return { success: true, data: result }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to create document",
      }
    }
  }

  /**
   * Delete a document by ID
   */
  async deleteDocument(id: string) {
    try {
      await this.request(`tables/documents/rows/${id}`, {
        method: "DELETE",
      })
      return { success: true, message: "Document deleted successfully" }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : `Failed to delete document ${id}`,
      }
    }
  }

  /**
   * Get documents for a specific project
   */
  async getProjectDocuments(projectId: string) {
    try {
      // Use a query to filter documents by project_id
      const result = await this.request(`tables/documents/rows?project_id=${encodeURIComponent(projectId)}`)
      return { success: true, data: result }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : `Failed to fetch documents for project ${projectId}`,
      }
    }
  }
}

// Create a singleton instance of the Nile client
export const nileClient = new NileClient()
