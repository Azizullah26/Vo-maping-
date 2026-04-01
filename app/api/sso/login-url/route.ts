import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

/**
 * SSO Login URL Handler
 * Generates a login redirect URL for Race-Hub SSO integration
 * 
 * Expected payload:
 * {
 *   "api_key": "rcc0085_map_security",
 *   "source": "hub"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    console.log("[v0] SSO /login-url endpoint called")

    const body = await request.json()
    const { api_key, source } = body

    console.log("[v0] SSO Request - API Key:", api_key ? "provided" : "missing", "Source:", source)

    // Validate API key
    const validApiKey = process.env.SSO_API_KEY || "rcc0085_map_security"
    if (api_key !== validApiKey) {
      console.warn("[v0] SSO: Invalid API key provided")
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401 }
      )
    }

    // Validate source
    if (!source || typeof source !== "string") {
      console.warn("[v0] SSO: Missing or invalid source")
      return NextResponse.json(
        { error: "Missing or invalid source parameter" },
        { status: 400 }
      )
    }

    // Generate login URL
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://elracemap.vercel.app"
    const loginUrl = `${siteUrl}/login?source=${encodeURIComponent(source)}&timestamp=${Date.now()}`

    console.log("[v0] SSO: Generated login URL for source:", source)

    // Return the login URL
    return NextResponse.json(
      {
        success: true,
        login_url: loginUrl,
        redirect_uri: loginUrl,
        expires_in: 3600, // 1 hour
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    )
  } catch (error) {
    console.error("[v0] SSO /login-url error:", error)
    
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

// Handle GET requests with helpful message
export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      error: "Method not allowed",
      message: "Use POST method with api_key and source in body",
      example: {
        method: "POST",
        body: {
          api_key: "rcc0085_map_security",
          source: "hub",
        },
      },
    },
    { status: 405 }
  )
}
