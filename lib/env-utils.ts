/**
 * Environment utilities for managing environment variables
 * Supports both server-side and client-side access patterns
 */

/**
 * Gets environment variables supporting both Next.js and React naming conventions
 * @param name The base name of the environment variable (without prefix)
 * @param defaultValue The default value if the variable is not set
 * @returns The value of the environment variable
 */
export function getEnvVariable(name: string, defaultValue?: string): string | undefined {
  // Check if we're on the client side
  const isClient = typeof window !== "undefined"

  // For client-side, only allow NEXT_PUBLIC_ variables
  if (isClient && !name.startsWith("NEXT_PUBLIC_")) {
    console.warn(`Cannot access server-only environment variable ${name} on client`)
    return defaultValue
  }

  const value = process.env[name]
  return value !== undefined ? value : defaultValue
}

/**
 * Gets server-side environment variables (only works on server)
 * @param key The environment variable name
 * @returns The value of the environment variable
 */
export function getServerEnvVariable(key: string): string | undefined {
  // Prevent access on client side
  if (typeof window !== "undefined") {
    console.warn(`Attempted to access server env variable "${key}" on the client side`)
    return undefined
  }

  return process.env[key]
}

/**
 * Gets an environment variable with a default fallback
 * @param key The environment variable name
 * @param defaultValue The default value if the variable is not set
 * @returns The value of the environment variable or the default
 */
export function getEnvVar(key: string, defaultValue?: string): string {
  const value = getEnvVariable(key, defaultValue) || getServerEnvVariable(key)

  if (!value && !defaultValue) {
    console.warn(`Environment variable ${key} is not set`)
    return ""
  }

  return value || defaultValue || ""
}

/**
 * Requires an environment variable to be set
 * @param key The environment variable name
 * @returns The value of the environment variable
 * @throws Error if the variable is not set
 */
export function requireEnvVar(key: string): string {
  const value = getEnvVar(key)

  if (!value) {
    throw new Error(`Required environment variable ${key} is not set`)
  }

  return value
}

/**
 * Safely gets NODE_ENV with fallback
 * @returns The NODE_ENV value or 'development' as fallback
 */
export function getNodeEnv(): string {
  // On client side, return a safe default
  if (typeof window !== "undefined") {
    return "production" // Assume production on client side
  }

  return process.env.NODE_ENV || "development"
}

/**
 * Checks if we're in development mode
 * @returns boolean indicating if in development
 */
export function isDevelopment(): boolean {
  return getNodeEnv() === "development"
}

/**
 * Checks if we're in production mode
 * @returns boolean indicating if in production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === "production"
}

/**
 * Checks if we're running on Vercel
 * @returns boolean indicating if on Vercel
 */
export function isVercel(): boolean {
  return process.env.VERCEL === "1" || !!process.env.VERCEL_ENV
}

/**
 * Gets the Supabase URL
 * @returns The Supabase URL or empty string
 */
export function getSupabaseUrl(): string {
  return getEnvVar("NEXT_PUBLIC_SUPABASE_URL", "")
}

/**
 * Gets the Supabase anonymous key
 * @returns The Supabase anon key or empty string
 */
export function getSupabaseAnonKey(): string {
  return getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY", "")
}

/**
 * Checks if Supabase credentials are available
 * @returns boolean indicating if credentials exist
 */
export function hasSupabaseCredentials(): boolean {
  return !!(getSupabaseUrl() && getSupabaseAnonKey())
}

/**
 * Gets the base URL for the application
 * @returns The base URL
 */
export function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL
  }

  return "http://localhost:3000"
}

/**
 * Checks if the app is in demo mode
 * @returns boolean indicating if in demo mode
 */
export function isDemoMode(): boolean {
  return getEnvVar("NEXT_PUBLIC_DEMO_MODE") === "true"
}

/**
 * Checks if the app is in static mode
 * @returns boolean indicating if in static mode
 */
export function isStaticMode(): boolean {
  return getEnvVar("NEXT_PUBLIC_STATIC_MODE") === "true"
}

type EnvVarStatus = {
  name: string
  exists: boolean
  value?: string
  isPublic: boolean
}

export function checkRequiredEnvVars(): {
  allPresent: boolean
  missing: string[]
  details: EnvVarStatus[]
} {
  // Only check essential public variables
  const requiredVars = ["NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN"]

  const details: EnvVarStatus[] = requiredVars.map((name) => {
    const value = process.env[name]
    return {
      name,
      exists: !!value,
      value: value ? "***" : undefined,
      isPublic: name.startsWith("NEXT_PUBLIC_"),
    }
  })

  const missing = details.filter((d) => !d.exists).map((d) => d.name)

  return {
    allPresent: missing.length === 0,
    missing,
    details,
  }
}

/**
 * Environment configuration object
 */
export const envConfig = {
  supabase: {
    url: getSupabaseUrl(),
    anonKey: getSupabaseAnonKey(),
    hasCredentials: hasSupabaseCredentials(),
  },
  app: {
    baseUrl: getBaseUrl(),
    isProduction: isProduction(),
    isDevelopment: isDevelopment(),
    isVercel: isVercel(),
    isDemoMode: isDemoMode(),
    isStaticMode: isStaticMode(),
  },
} as const

/**
 * Gets all public environment variables safe for client-side use
 * @returns Object containing public environment variables
 */
export function getPublicEnvVars() {
  return {
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }
}

/**
 * Validates that all required environment variables are present
 * @returns boolean indicating if all required variables are set
 */
export function hasRequiredEnvVars(): boolean {
  try {
    const mapboxAccessToken = getEnvVar("NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN")
    return !!mapboxAccessToken
  } catch {
    return false
  }
}
