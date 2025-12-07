// Nile client for server-side operations only
// This file should only be used on the server side

interface NileConfig {
  url?: string
  apiToken?: string
}

class NileClient {
  private config: NileConfig | null = null

  private getConfig(): NileConfig {
    if (!this.config) {
      this.config = {
        url: process.env.NILEDB_URL,
        apiToken: process.env.NILEDB_API_TOKEN,
      }
    }
    return this.config
  }

  async query(sql: string, params?: any[]) {
    const config = this.getConfig()

    if (!config.url || !config.apiToken) {
      throw new Error(
        "Nile configuration is missing. Please set NILEDB_URL and NILEDB_API_TOKEN environment variables.",
      )
    }

    try {
      const response = await fetch(`${config.url}/api/sql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiToken}`,
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

let _nileClientInstance: NileClient | null = null

export function getNileClient(): NileClient {
  if (!_nileClientInstance) {
    _nileClientInstance = new NileClient()
  }
  return _nileClientInstance
}

export const nileClient = { get: getNileClient }
export default { get: getNileClient }
