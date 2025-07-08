import { NextResponse } from "next/server"
import { errorCollector } from "@/lib/error-collector"

export async function GET() {
  try {
    const healthChecks = errorCollector.checkDeploymentHealth()
    const errors = errorCollector.getErrors()

    const deploymentStatus = {
      status: Object.values(healthChecks).every((check) => check === true) ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      checks: healthChecks,
      errors: errors,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        nextVersion: process.env.npm_package_dependencies_next || "unknown",
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      },
    }

    return NextResponse.json(deploymentStatus)
  } catch (error) {
    console.error("Health check failed:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Health check failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
