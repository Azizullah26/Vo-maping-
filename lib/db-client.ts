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

let _dbClient: StaticDbClient | null = null

export function getDbClient(): DbClient {
  if (!_dbClient) {
    _dbClient = new StaticDbClient()
  }
  return _dbClient
}

// Keep backwards compatibility
export const dbClient = {
  query: (sql: string, params?: any[]) => getDbClient().query(sql, params),
  isConnected: () => getDbClient().isConnected(),
}

export async function testDatabaseConnection() {
  return {
    success: false,
    message: "Database not configured - using static data",
    timestamp: new Date().toISOString(),
  }
}
