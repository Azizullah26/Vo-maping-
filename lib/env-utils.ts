/**
 * Gets environment variables supporting both Next.js and React naming conventions
 * @param key The base name of the environment variable (without prefix)
 * @returns The value of the environment variable
 */
export function getEnvVariable(key: string): string | undefined {
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
  const requiredVars = ["SUPABASE_URL", "SUPABASE_ANON_KEY"]
  const missing: string[] = []
  const values: Record<string, string | undefined> = {}

  for (const key of requiredVars) {
    const value = getEnvVariable(key)
    values[key] = value
    if (!value) missing.push(key)
  }

  return {
    isValid: missing.length === 0,
    missing,
    values,
  }
}
