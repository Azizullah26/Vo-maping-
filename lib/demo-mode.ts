/**
 * Demo mode utilities for the application
 */

export const isDemoMode = () => {
  return process.env.NEXT_PUBLIC_DEMO_MODE === "true"
}

export const isStaticMode = () => {
  return process.env.NEXT_PUBLIC_STATIC_MODE === "true"
}

export const isProductionBuild = () => {
  return process.env.NODE_ENV === "production"
}

export const hasSupabaseConfig = () => {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

export const shouldUseDemoData = () => {
  return isDemoMode() || !hasSupabaseConfig()
}

export const getAppMode = () => {
  if (isDemoMode()) return "demo"
  if (isStaticMode()) return "static"
  if (hasSupabaseConfig()) return "full"
  return "limited"
}
