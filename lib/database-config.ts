// Central configuration file for database integrations

// Database integration types
export type DatabaseType = "supabase" | "neon" | "redis"

// Configuration for which database to use for which feature
export const databaseConfig = {
  // User authentication and management
  auth: "supabase" as DatabaseType,

  // Document storage and management
  documents: "supabase" as DatabaseType,

  // Geographic data and map information
  mapData: "neon" as DatabaseType,

  // Caching and temporary data
  cache: "redis" as DatabaseType,

  // Session management
  sessions: "redis" as DatabaseType,

  // Analytics and metrics
  analytics: "neon" as DatabaseType,
}

// Environment variable mapping
export const databaseEnvVars = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
  neon: {
    url: process.env.POSTGRES_URL,
    directUrl: process.env.POSTGRES_URL_NON_POOLING,
  },
  redis: {
    url: process.env.KV_URL,
    token: process.env.KV_REST_API_TOKEN,
  },
}

// Check if a specific database integration is configured
export function isDatabaseConfigured(type: DatabaseType): boolean {
  switch (type) {
    case "supabase":
      return !!databaseEnvVars.supabase.url && !!databaseEnvVars.supabase.anonKey
    case "neon":
      return !!databaseEnvVars.neon.url
    case "redis":
      return !!databaseEnvVars.redis.url && !!databaseEnvVars.redis.token
    default:
      return false
  }
}

// Get the database type to use for a specific feature
export function getDatabaseForFeature(feature: keyof typeof databaseConfig): DatabaseType {
  const configuredType = databaseConfig[feature]

  // If the configured database is not available, fall back to an available one
  if (!isDatabaseConfigured(configuredType)) {
    if (isDatabaseConfigured("supabase")) return "supabase"
    if (isDatabaseConfigured("neon")) return "neon"
    if (isDatabaseConfigured("redis")) return "redis"

    // If no database is configured, default to supabase
    return "supabase"
  }

  return configuredType
}
