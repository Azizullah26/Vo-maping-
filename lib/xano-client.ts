import { xanoConfig, xanoEndpoints } from "./xano-config"

class XanoClient {
  private baseURL: string
  private apiKey: string
  private authToken: string | null = null

  constructor() {
    this.baseURL = xanoConfig.baseURL
    this.apiKey = xanoConfig.apiKey

    // Get auth token from localStorage if available
    if (typeof window !== "undefined") {
      this.authToken = localStorage.getItem("xano_auth_token")
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<{ data: T; success: boolean; error?: string }> {
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        "X-API-Key": this.apiKey,
        ...options.headers,
      }

      if (this.authToken) {
        headers["Authorization"] = `Bearer ${this.authToken}`
      }

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Request failed")
      }

      return { data, success: true }
    } catch (error) {
      console.error("Xano request error:", error)
      return {
        data: null as T,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  // Authentication methods
  async login(email: string, password: string) {
    const result = await this.request<{ authToken: string; user: any }>(xanoEndpoints.login, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })

    if (result.success && result.data.authToken) {
      this.authToken = result.data.authToken
      if (typeof window !== "undefined") {
        localStorage.setItem("xano_auth_token", result.data.authToken)
      }
    }

    return result
  }

  async register(userData: { email: string; password: string; name: string }) {
    return this.request(xanoEndpoints.register, {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async getCurrentUser() {
    return this.request(xanoEndpoints.me)
  }

  async logout() {
    this.authToken = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("xano_auth_token")
    }
  }

  // Projects methods
  async getProjects() {
    return this.request<any[]>(xanoEndpoints.projects)
  }

  async getProjectById(id: string) {
    return this.request(xanoEndpoints.projectById(id))
  }

  async createProject(projectData: any) {
    return this.request(xanoEndpoints.projects, {
      method: "POST",
      body: JSON.stringify(projectData),
    })
  }

  async updateProject(id: string, projectData: any) {
    return this.request(xanoEndpoints.projectById(id), {
      method: "PATCH",
      body: JSON.stringify(projectData),
    })
  }

  async deleteProject(id: string) {
    return this.request(xanoEndpoints.projectById(id), {
      method: "DELETE",
    })
  }

  // Documents methods
  async getDocuments() {
    return this.request<any[]>(xanoEndpoints.documents)
  }

  async getDocumentsByProject(projectId: string) {
    return this.request<any[]>(xanoEndpoints.documentsByProject(projectId))
  }

  async uploadDocument(file: File, projectId: string, metadata: any = {}) {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("project_id", projectId)
    formData.append("metadata", JSON.stringify(metadata))

    return this.request(xanoEndpoints.uploadDocument, {
      method: "POST",
      body: formData,
      headers: {}, // Remove Content-Type to let browser set it for FormData
    })
  }

  async deleteDocument(id: string) {
    return this.request(`/documents/${id}`, {
      method: "DELETE",
    })
  }

  // File upload helper
  async uploadFile(file: File, folder = "general") {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("folder", folder)

    return this.request("/upload", {
      method: "POST",
      body: formData,
      headers: {},
    })
  }
}

export const xanoClient = new XanoClient()
