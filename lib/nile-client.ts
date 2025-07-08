// Nile client for server-side operations only
// This file should only be used on the server side

interface NileConfig {
  url?: string
  apiToken?: string
}

class NileClient {
  private config: NileConfig

  constructor() {
    // Only use server-side environment variables (no NEXT_PUBLIC_ prefix)
    this.config = {
      url: process.env.NILEDB_URL,
      apiToken: process.env.NILEDB_API_TOKEN,
    }
  }

  async query(sql: string, params?: any[]) {
    if (!this.config.url || !this.config.apiToken) {
      throw new Error(
        "Nile configuration is missing. Please set NILEDB_URL and NILEDB_API_TOKEN environment variables.",
      )
    }

    try {
      const response = await fetch(`${this.config.url}/api/sql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.apiToken}`,
        },
        body: JSON.stringify({ sql, params }),
      })

      if (!response.ok) {
        throw new Error(`Nile query failed: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Nile query error:", error)
      throw error
    }
  }

  async testConnection() {
    try {
      const result = await this.query("SELECT 1 as test")
      return { success: true, result }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }
}

export const nileClient = new NileClient()
export default nileClient
