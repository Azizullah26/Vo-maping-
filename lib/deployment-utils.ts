/**
 * Deployment utilities for handling environment-specific logic
 */

export function isDeploymentEnvironment(): boolean {
  return process.env.VERCEL === "1" || process.env.NODE_ENV === "production"
}

export function isDevelopmentEnvironment(): boolean {
  return process.env.NODE_ENV === "development"
}

export function getDeploymentUrl(): string {
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

export function getDeploymentInfo() {
  return {
    environment: process.env.NODE_ENV || "development",
    isVercel: process.env.VERCEL === "1",
    vercelEnv: process.env.VERCEL_ENV,
    url: getDeploymentUrl(),
    region: process.env.VERCEL_REGION,
    timestamp: new Date().toISOString(),
  }
}

export async function checkDeploymentHealth(): Promise<{
  healthy: boolean
  checks: Record<string, boolean>
  message: string
}> {
  const checks = {
    envVars: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    runtime: typeof process !== "undefined",
    deployment: isDeploymentEnvironment(),
  }

  const healthy = Object.values(checks).every(Boolean)

  return {
    healthy,
    checks,
    message: healthy ? "All deployment checks passed" : "Some deployment checks failed",
  }
}
