/**
 * Server-only environment utilities
 * These functions should only be used on the server side
 */

/**
 * Assert we're on the server side
 */
function assertServer() {
  if (typeof window !== "undefined") {
    throw new Error("This function can only be called on the server side")
  }
}

/**
 * Get NODE_ENV (server-only)
 */
export function getNodeEnv(): string {
  assertServer()
  return process.env.NODE_ENV || "development"
}

/**
 * Check if we're in development (server-only)
 */
export function isDevelopment(): boolean {
  assertServer()
  return getNodeEnv() === "development"
}

/**
 * Check if we're in production (server-only)
 */
export function isProduction(): boolean {
  assertServer()
  return getNodeEnv() === "production"
}

/**
 * Get database URL (server-only)
 */
export function getDatabaseUrl(): string | undefined {
  assertServer()
  return process.env.DATABASE_URL || process.env.POSTGRES_URL
}

/**
 * Get Supabase service role key (server-only)
 */
export function getSupabaseServiceRoleKey(): string | undefined {
  assertServer()
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SUPABASE_SERVICE_ROLE_KEY
}

/**
 * Get all server environment variables for debugging (server-only)
 */
export function getServerEnvVars(): Record<string, string | undefined> {
  assertServer()
  return {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL ? "[REDACTED]" : undefined,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "[REDACTED]" : undefined,
    VERCEL: process.env.VERCEL,
  }
}
