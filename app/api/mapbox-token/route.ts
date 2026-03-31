import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// Load env variables on every request as a fallback
function ensureEnvLoaded() {
  if (process.env.MAPBOX_ACCESS_TOKEN) {
    return // Already loaded
  }

  try {
    const possiblePaths = [
      path.join(process.cwd(), ".env.local"),
      path.join(process.cwd(), "..", ".env.local"),
      "/vercel/share/v0-project/.env.local",
      "/vercel/share/v0-next-shadcn/.env.local",
    ]

    let found = false
    for (const filePath of possiblePaths) {
      if (fs.existsSync(filePath)) {
        console.log(`[v0] Loading .env.local from: ${filePath}`)
        const content = fs.readFileSync(filePath, "utf-8")
        const lines = content.split("\n")

        for (const line of lines) {
          if (!line || line.startsWith("#")) continue
          const [key, ...valueParts] = line.split("=")
          const cleanKey = key.trim()
          const value = valueParts.join("=").trim()

          if (cleanKey && value && !process.env[cleanKey]) {
            process.env[cleanKey] = value
          }
        }
        found = true
        break
      }
    }

    if (!found) {
      console.warn("[v0] .env.local not found in any location")
    }
  } catch (error) {
    console.error("[v0] Error loading .env.local:", error)
  }
}

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET() {
  try {
    // Ensure env is loaded
    ensureEnvLoaded()

    const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN

    console.log("[v0] Mapbox token check:")
    console.log("[v0] - Token exists:", !!mapboxToken)
    console.log("[v0] - Token value (first 20 chars):", mapboxToken?.substring(0, 20))

    if (!mapboxToken) {
      console.warn("[v0] MAPBOX_ACCESS_TOKEN environment variable is not configured")

      return NextResponse.json(
        {
          error: "Mapbox token not configured. Please add MAPBOX_ACCESS_TOKEN to your environment variables or .env.local file.",
          token: null,
          configured: false,
        },
        { status: 200 },
      )
    }

    console.log("[v0] Successfully returning Mapbox token")
    return NextResponse.json(
      {
        token: mapboxToken,
        configured: true,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=3600",
        },
      },
    )
  } catch (error) {
    console.error("[v0] Error fetching Mapbox token:", error)
    return NextResponse.json(
      {
        error: "Internal server error while fetching token",
        token: null,
        configured: false,
      },
      { status: 500 },
    )
  }
}
