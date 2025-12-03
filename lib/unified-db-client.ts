import { createClient } from "@supabase/supabase-js"
import type { SupabaseClient } from "@supabase/supabase-js"

export interface Document {
  id: string
  name: string
  file_name?: string
  type: string
  file_type?: string
  size?: number
  file_size?: number
  file_path?: string
  file_url?: string
  project_id: string
  project_name?: string
  document_type?: string
  description?: string
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  name: string
  description?: string
  location?: string
  status?: string
  created_at: string
  updated_at: string
}

// Unified database client interface
// Ready for future database integration

interface QueryResult {
  rows: any[]
  rowCount: number
}

interface UnifiedDbClient {
  query: (sql: string, params?: any[]) => Promise<QueryResult>
  testConnection: () => Promise<boolean>
  isReady: () => boolean
}

class StaticDataClient implements UnifiedDbClient {
  async query(sql: string, params?: any[]): Promise<QueryResult> {
    console.log("Query executed on static data client:", sql)
    return { rows: [], rowCount: 0 }
  }

  async testConnection(): Promise<boolean> {
    return false
  }

  isReady(): boolean {
    return true // Static data is always ready
  }
}

class UnifiedDBClient implements UnifiedDbClient {
  private supabase: SupabaseClient | null = null
  private initialized = false

  private initialize() {
    if (this.initialized) return

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseKey) {
        console.warn("Supabase credentials not found")
        return
      }

      this.supabase = createClient(supabaseUrl, supabaseKey)
      this.initialized = true
    } catch (error) {
      console.error("Failed to initialize Supabase client:", error)
    }
  }

  private ensureInitialized() {
    if (!this.initialized) {
      this.initialize()
    }
  }

  // Document methods
  async getDocuments(projectId?: string): Promise<Document[]> {
    this.ensureInitialized()
    if (!this.supabase) {
      console.error("Supabase client not initialized")
      return []
    }

    try {
      let query = this.supabase.from("documents").select("*")

      if (projectId) {
        query = query.eq("project_id", projectId)
      }

      const { data, error } = await query.order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching documents:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Error in getDocuments:", error)
      return []
    }
  }

  async getDocumentById(id: string): Promise<Document | null> {
    this.ensureInitialized()
    if (!this.supabase) {
      console.error("Supabase client not initialized")
      return null
    }

    try {
      const { data, error } = await this.supabase.from("documents").select("*").eq("id", id).single()

      if (error) {
        console.error("Error fetching document:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error in getDocumentById:", error)
      return null
    }
  }

  async createDocument(document: Omit<Document, "id" | "created_at" | "updated_at">): Promise<Document | null> {
    this.ensureInitialized()
    if (!this.supabase) {
      console.error("Supabase client not initialized")
      return null
    }

    try {
      const { data, error } = await this.supabase.from("documents").insert([document]).select().single()

      if (error) {
        console.error("Error creating document:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error in createDocument:", error)
      return null
    }
  }

  async updateDocument(id: string, updates: Partial<Document>): Promise<Document | null> {
    this.ensureInitialized()
    if (!this.supabase) {
      console.error("Supabase client not initialized")
      return null
    }

    try {
      const { data, error } = await this.supabase.from("documents").update(updates).eq("id", id).select().single()

      if (error) {
        console.error("Error updating document:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error in updateDocument:", error)
      return null
    }
  }

  async deleteDocument(id: string): Promise<boolean> {
    this.ensureInitialized()
    if (!this.supabase) {
      console.error("Supabase client not initialized")
      return false
    }

    try {
      const { error } = await this.supabase.from("documents").delete().eq("id", id)

      if (error) {
        console.error("Error deleting document:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Error in deleteDocument:", error)
      return false
    }
  }

  // Project methods
  async getProjects(): Promise<Project[]> {
    this.ensureInitialized()
    if (!this.supabase) {
      console.error("Supabase client not initialized")
      return []
    }

    try {
      const { data, error } = await this.supabase.from("projects").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching projects:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Error in getProjects:", error)
      return []
    }
  }

  async getProjectById(id: string): Promise<Project | null> {
    this.ensureInitialized()
    if (!this.supabase) {
      console.error("Supabase client not initialized")
      return null
    }

    try {
      const { data, error } = await this.supabase.from("projects").select("*").eq("id", id).single()

      if (error) {
        console.error("Error fetching project:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error in getProjectById:", error)
      return null
    }
  }

  async createProject(project: Omit<Project, "id" | "created_at" | "updated_at">): Promise<Project | null> {
    this.ensureInitialized()
    if (!this.supabase) {
      console.error("Supabase client not initialized")
      return null
    }

    try {
      const { data, error } = await this.supabase.from("projects").insert([project]).select().single()

      if (error) {
        console.error("Error creating project:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error in createProject:", error)
      return null
    }
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    this.ensureInitialized()
    if (!this.supabase) {
      console.error("Supabase client not initialized")
      return null
    }

    try {
      const { data, error } = await this.supabase.from("projects").update(updates).eq("id", id).select().single()

      if (error) {
        console.error("Error updating project:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error in updateProject:", error)
      return null
    }
  }

  async deleteProject(id: string): Promise<boolean> {
    this.ensureInitialized()
    if (!this.supabase) {
      console.error("Supabase client not initialized")
      return false
    }

    try {
      const { error } = await this.supabase.from("projects").delete().eq("id", id)

      if (error) {
        console.error("Error deleting project:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Error in deleteProject:", error)
      return false
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    this.ensureInitialized()
    if (!this.supabase) {
      return false
    }

    try {
      const { error } = await this.supabase.from("projects").select("count", { count: "exact", head: true })

      return !error
    } catch (error) {
      console.error("Health check failed:", error)
      return false
    }
  }

  // Get the raw Supabase client if needed
  getClient(): SupabaseClient | null {
    this.ensureInitialized()
    return this.supabase
  }

  // Implementing UnifiedDbClient methods
  async query(sql: string, params?: any[]): Promise<QueryResult> {
    this.ensureInitialized()
    if (!this.supabase) {
      console.error("Supabase client not initialized")
      return { rows: [], rowCount: 0 }
    }

    try {
      const { data, error } = await this.supabase.rpc(sql, params)

      if (error) {
        console.error("Error executing query:", error)
        return { rows: [], rowCount: 0 }
      }

      return { rows: data || [], rowCount: (data || []).length }
    } catch (error) {
      console.error("Error in query:", error)
      return { rows: [], rowCount: 0 }
    }
  }

  async testConnection(): Promise<boolean> {
    return this.healthCheck()
  }

  isReady(): boolean {
    this.ensureInitialized()
    return this.initialized
  }
}

let _dbClientInstance: UnifiedDBClient | null = null
let _unifiedDbInstance: StaticDataClient | null = null

export function getDbClient(): UnifiedDBClient {
  if (!_dbClientInstance) {
    _dbClientInstance = new UnifiedDBClient()
  }
  return _dbClientInstance
}

export function getUnifiedDb(): StaticDataClient {
  if (!_unifiedDbInstance) {
    _unifiedDbInstance = new StaticDataClient()
  }
  return _unifiedDbInstance
}

export const dbClient = { get: getDbClient }
export const unifiedDb = { get: getUnifiedDb }

export async function initializeDatabase() {
  return {
    success: true,
    message: "Using static data from data/ folder",
    client: "static",
  }
}

export async function getDatabaseStatus() {
  return {
    connected: false,
    client: "static",
    message: "Application running with static data",
  }
}
