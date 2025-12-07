import { NextResponse } from "next/server"
import { checkDeploymentHealth } from "@/lib/deployment-utils"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const health = await checkDeploymentHealth()

    return NextResponse.json(
      {
        status: health.healthy ? "ready" : "starting",
        ...health,
        timestamp: new Date().toISOString(),
      },
      { status: health.healthy ? 200 : 503 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
