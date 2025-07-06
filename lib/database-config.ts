// Central configuration file for database integrations

// Database integration types
export type DatabaseType = "supabase"

// Configuration for which database to use for which feature
export const databaseConfig = {
  // User authentication and management
  auth: "supabase" as DatabaseType,

  // Document storage and management
  documents: "supabase" as DatabaseType,

  // Geographic data and map information
  mapData: "supabase" as DatabaseType,

  // Caching and temporary data
  cache: "supabase" as DatabaseType, // Will use Supabase for caching if no Redis
  // Session management
  sessions: "supabase" as DatabaseType, // Will use Supabase for sessions if no Redis

  // Analytics and metrics
  analytics: "supabase" as DatabaseType,
}

// Environment variable mapping
export const databaseEnvVars = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
}

// Check if a specific database integration is configured
export function isDatabaseConfigured(type: DatabaseType): boolean {
  switch (type) {
    case "supabase":
      return !!databaseEnvVars.supabase.url && !!databaseEnvVars.supabase.anonKey
    default:
      return false
  }
}

// Get the database type to use for a specific feature
export function getDatabaseForFeature(feature: keyof typeof databaseConfig): DatabaseType {
  const configuredType = databaseConfig[feature]

  // If the configured database is not available, fall back to Supabase
  if (!isDatabaseConfigured(configuredType)) {
    if (isDatabaseConfigured("supabase")) return "supabase"
    // If no database is configured, default to supabase
    return "supabase"
  }

  return configuredType
}
