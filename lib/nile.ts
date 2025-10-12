import { NileServer } from "@niledatabase/server"

// Initialize Nile with environment variables
export async function getNileServer() {
  try {
    const nile = await NileServer({
      secureCookies: process.env.VERCEL === "1",
      workspace: process.env.NILEDB_USER,
      database: "map_project_uae",
      api: {
        basePath: process.env.NILEDB_API_URL,
      },
      credentials: {
        password: process.env.NILEDB_PASSWORD,
      },
    })

    return nile
  } catch (error) {
    console.error("Failed to initialize Nile server:", error)
    throw error
  }
}

// Create a singleton instance for server components
let nileServerInstance: Awaited<ReturnType<typeof getNileServer>> | null = null

export async function getNileServerSingleton() {
  if (!nileServerInstance) {
    try {
      nileServerInstance = await getNileServer()
    } catch (error) {
      console.error("Failed to get Nile server singleton:", error)
      throw error
    }
  }
  return nileServerInstance
}
