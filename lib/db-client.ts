// Database client - ready for future integration
// Currently using static data from data/ folder

interface DbClient {
  query: (sql: string, params?: any[]) => Promise<any>
  isConnected: () => boolean
}

class StaticDbClient implements DbClient {
  async query(sql: string, params?: any[]) {
    console.log("Using static data - database not connected")
    return { rows: [], rowCount: 0 }
  }

  isConnected() {
    return false
  }
}

export const dbClient = new StaticDbClient()

export async function testDatabaseConnection() {
  return {
    success: false,
    message: "Database not configured - using static data",
    timestamp: new Date().toISOString(),
  }
}
