/**
 * Client-side environment utilities
 * Only includes variables that are safe to expose to the client
 */

/**
 * Get Supabase URL (client-safe)
 */
export function getSupabaseUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL
}

/**
 * Get Supabase anonymous key (client-safe)
 */
export function getSupabaseAnonKey(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY
}

/**
 * Check if we're in demo mode (client-safe)
 */
export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === "true"
}

/**
 * Check if we're in static mode (client-safe)
 */
export function isStaticMode(): boolean {
  return process.env.NEXT_PUBLIC_STATIC_MODE === "true"
}

/**
 * Get base URL (client-safe)
 */
export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
}

/**
 * Get all client environment variables for debugging (client-safe only)
 */
export function getClientEnvVars(): Record<string, string | undefined> {
  return {
    NEXT_PUBLIC_SUPABASE_URL: getSupabaseUrl(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: getSupabaseAnonKey() ? "[PRESENT]" : undefined,
    NEXT_PUBLIC_DEMO_MODE: process.env.NEXT_PUBLIC_DEMO_MODE,
    NEXT_PUBLIC_STATIC_MODE: process.env.NEXT_PUBLIC_STATIC_MODE,
    NEXT_PUBLIC_BASE_URL: getBaseUrl(),
  }
}
