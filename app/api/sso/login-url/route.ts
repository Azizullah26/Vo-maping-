import { NextResponse } from "next/server"

/**
 * POST /api/sso/login-url
 * Generates and returns the SSO login redirect URL
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { redirectUrl, state } = body

    // Validate redirect URL
    if (!redirectUrl) {
      return NextResponse.json(
        { error: "Missing redirectUrl parameter" },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      new URL(redirectUrl)
    } catch {
      return NextResponse.json(
        { error: "Invalid redirectUrl format" },
        { status: 400 }
      )
    }

    // Generate state parameter if not provided (for CSRF protection)
    const stateParam = state || Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString("hex")

    // Get the configured redirect URL from environment
    const authRedirectUrl = process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL || redirectUrl

    // Return the SSO login URL
    const response = {
      loginUrl: authRedirectUrl,
      state: stateParam,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error("SSO login-url error:", error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Failed to generate SSO login URL" 
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/sso/login-url
 * Also support GET requests for simplicity
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const redirectUrl = searchParams.get("redirectUrl")
    const state = searchParams.get("state")

    if (!redirectUrl) {
      return NextResponse.json(
        { error: "Missing redirectUrl parameter" },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      new URL(redirectUrl)
    } catch {
      return NextResponse.json(
        { error: "Invalid redirectUrl format" },
        { status: 400 }
      )
    }

    // Generate state parameter if not provided
    const stateParam = state || Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString("hex")

    // Get the configured redirect URL from environment
    const authRedirectUrl = process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL || redirectUrl

    const response = {
      loginUrl: authRedirectUrl,
      state: stateParam,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error("SSO login-url error:", error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Failed to generate SSO login URL" 
      },
      { status: 500 }
    )
  }
}

/**
 * OPTIONS /api/sso/login-url
 * Handle CORS preflight requests
 */
export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
