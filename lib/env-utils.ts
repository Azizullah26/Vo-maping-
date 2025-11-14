export function getEnvVariable(name: string, defaultValue?: string): string | undefined {
  const isClient = typeof window !== "undefined"

  if (isClient && !name.startsWith("NEXT_PUBLIC_")) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`Cannot access server-only environment variable ${name} on client`)
    }
    return defaultValue
  }

  const value = process.env[name]
  return value !== undefined ? value : defaultValue
}

export function getServerEnvVariable(key: string): string | undefined {
  if (typeof window !== "undefined") {
    console.warn(`Attempted to access server env variable "${key}" on the client side`)
    return undefined
  }

  return process.env[key]
}

export function getEnvVar(key: string, defaultValue?: string): string {
  const value = getEnvVariable(key, defaultValue) || getServerEnvVariable(key)

  if (!value && !defaultValue) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`Environment variable ${key} is not set`)
    }
    return ""
  }

  return value || defaultValue || ""
}

export function requireEnvVar(key: string): string {
  const value = getEnvVar(key)

  if (!value) {
    throw new Error(`Required environment variable ${key} is not set`)
  }

  return value
}

export function getNodeEnv(): string {
  if (typeof window !== "undefined") {
    return "production"
  }

  return process.env.NODE_ENV || "development"
}

export function isDevelopment(): boolean {
  return getNodeEnv() === "development"
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === "production"
}

export function isVercel(): boolean {
  return process.env.VERCEL === "1" || !!process.env.VERCEL_ENV
}

export function getSupabaseUrl(): string {
  return getEnvVar("NEXT_PUBLIC_SUPABASE_URL", "")
}

export function getSupabaseAnonKey(): string {
  return getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY", "")
}

export function hasSupabaseCredentials(): boolean {
  return !!(getSupabaseUrl() && getSupabaseAnonKey())
}

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

export function isDemoMode(): boolean {
  return getEnvVar("NEXT_PUBLIC_DEMO_MODE") === "true"
}

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
  const requiredVars = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"]

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

export function getPublicEnvVars() {
  return {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }
}

export function hasRequiredEnvVars(): boolean {
  try {
    const supabaseUrl = getEnvVar("NEXT_PUBLIC_SUPABASE_URL")
    const supabaseKey = getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY")
    return !!(supabaseUrl && supabaseKey)
  } catch {
    return false
  }
}
