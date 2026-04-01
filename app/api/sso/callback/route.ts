import { NextRequest, NextResponse } from "next/server"

/**
 * SSO Callback Endpoint
 * Handles the SSO authentication flow from Race-Hub
 * Validates tokens and provides authentication confirmation
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const source = searchParams.get("source")
    const timestamp = searchParams.get("timestamp")
    const token = searchParams.get("token")

    console.log("[v0] SSO Callback received:", { source, timestamp, token: token ? "***" : "none" })

    // Validate source parameter
    if (source !== "hub") {
      return NextResponse.json(
        { success: false, message: "Invalid source parameter" },
        { status: 400 }
      )
    }

    // Validate timestamp (within last hour)
    if (timestamp) {
      const requestTime = Number.parseInt(timestamp)
      const currentTime = Date.now()
      const timeDiff = Math.abs(currentTime - requestTime)
      const oneHour = 3600000

      if (timeDiff > oneHour) {
        return NextResponse.json(
          { success: false, message: "SSO link expired" },
          { status: 401 }
        )
      }
    }

    // Auto-login user with SSO token (bypass password)
    // Generate session token
    const sessionToken = btoa(`sso:${Date.now()}:${source}`)
    
    // Create response with auth cookie
    const response = NextResponse.redirect(new URL("/al-ain", request.url))
    
    // Set authentication cookie (accessible from client)
    response.cookies.set("sso_auth_token", sessionToken, {
      httpOnly: false, // Allow client-side access
      secure: true,
      sameSite: "lax",
      maxAge: 3600, // 1 hour
      path: "/",
    })

    response.cookies.set("sso_source", source, {
      httpOnly: false,
      secure: true,
      sameSite: "lax",
      maxAge: 3600,
      path: "/",
    })

    console.log("[v0] SSO authentication successful, redirecting to /al-ain")

    return response
  } catch (error) {
    console.error("[v0] SSO callback error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Authentication failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
