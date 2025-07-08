import { NextResponse } from "next/server"
import { errorCollector } from "@/lib/error-collector"

export async function GET() {
  try {
    const healthCheck = errorCollector.checkDeploymentHealth()
    const errors = errorCollector.getErrors()

    const status = {
      healthy: Object.values(healthCheck).every((check) => check === true),
      checks: healthCheck,
      errors: errors,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    }

    return NextResponse.json(status, {
      status: status.healthy ? 200 : 500,
    })
  } catch (error) {
    console.error("Health check failed:", error)
    return NextResponse.json(
      {
        healthy: false,
        error: "Health check failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
