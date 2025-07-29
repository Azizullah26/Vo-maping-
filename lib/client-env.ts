/**
 * Client-safe environment utilities
 * These functions can be safely used on both client and server
 */

/**
 * Get demo mode setting (client-safe)
 */
export function isDemoMode(): boolean {
  // Check for NEXT_PUBLIC_ prefixed version first
  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE || process.env.REACT_APP_DEMO_MODE
  return demoMode === "true"
}

/**
 * Get static mode setting (client-safe)
 */
export function isStaticMode(): boolean {
  const staticMode = process.env.NEXT_PUBLIC_STATIC_MODE || process.env.REACT_APP_STATIC_MODE
  return staticMode === "true"
}

/**
 * Get Supabase URL (client-safe)
 */
export function getSupabaseUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL
}

/**
 * Get Supabase Anon Key (client-safe)
 */
export function getSupabaseAnonKey(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY
}

/**
 * Get Mapbox token (client-safe)
 */
export function getMapboxToken(): string | undefined {
  return process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || process.env.NEXT_PUBLIC_MAPBOX_TOKEN
}

/**
 * Get Cesium token (client-safe)
 */
export function getCesiumToken(): string | undefined {
  return process.env.NEXT_PUBLIC_CESIUM_ACCESS_TOKEN
}

/**
 * Check if we're running on Vercel (client-safe)
 */
export function isVercel(): boolean {
  return process.env.NEXT_PUBLIC_VERCEL === "1" || process.env.VERCEL === "1"
}

/**
 * Get base URL (client-safe)
 */
export function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin
  }

  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
}
