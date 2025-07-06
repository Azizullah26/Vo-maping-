// Xano configuration
export const xanoConfig = {
  baseURL: process.env.NEXT_PUBLIC_XANO_BASE_URL || "",
  apiKey: process.env.XANO_API_KEY || "",
  authURL: process.env.NEXT_PUBLIC_XANO_AUTH_URL || "",
  fileUploadURL: process.env.NEXT_PUBLIC_XANO_FILE_UPLOAD_URL || "",
}

// Xano endpoints
export const xanoEndpoints = {
  // Authentication
  login: "/auth/login",
  register: "/auth/register",
  me: "/auth/me",
  refresh: "/auth/refresh",

  // Projects
  projects: "/projects",
  projectById: (id: string) => `/projects/${id}`,

  // Documents
  documents: "/documents",
  documentsByProject: (projectId: string) => `/documents/project/${projectId}`,
  uploadDocument: "/documents/upload",

  // Users
  users: "/users",
  userById: (id: string) => `/users/${id}`,

  // Real-time
  websocket: "/ws",
}
