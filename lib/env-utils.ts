/**
 * Gets environment variables supporting both Next.js and React naming conventions
 * @param key The base name of the environment variable (without prefix)
 * @returns The value of the environment variable
 */
export function getEnvVariable(key: string): string | undefined {
  // Only allow access to NEXT_PUBLIC_ variables in the browser
  if (typeof window !== "undefined" && !key.startsWith("NEXT_PUBLIC_")) {
    console.warn(`Attempted to access non-public env variable "${key}" on the client side`)
    return undefined
  }

  // Try Next.js naming convention first
  const nextValue = process.env[`NEXT_PUBLIC_${key}`]
  if (nextValue) return nextValue

  // Fall back to React naming convention
  const reactValue = process.env[`REACT_APP_${key}`]
  if (reactValue) return reactValue

  // Return undefined if neither exists
  return undefined
}

/**
 * Checks if required environment variables are set
 * @returns Object with status and missing variables
 */
export function checkRequiredEnvVars(): {
  isValid: boolean
  missing: string[]
  values: Record<string, string | undefined>
} {
  // Only check public variables on the client side
  const requiredVars =
    typeof window !== "undefined"
      ? ["SUPABASE_URL", "SUPABASE_ANON_KEY"]
      : ["SUPABASE_URL", "SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY"]

  const missing: string[] = []
  const values: Record<string, string | undefined> = {}

  for (const key of requiredVars) {
    const value = getEnvVariable(key)
    // Don't include sensitive values in client-side code
    values[key] = typeof window !== "undefined" && !key.startsWith("NEXT_PUBLIC_") ? "REDACTED" : value
    if (!value) missing.push(key)
  }

  return {
    isValid: missing.length === 0,
    missing,
    values,
  }
}
