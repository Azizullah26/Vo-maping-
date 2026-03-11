import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import crypto from "crypto"

/**
 * Shared in-process SSO token store.
 * Tokens are written here by /api/sso/login-url and consumed here.
 *
 * For multi-instance / edge deployments, swap this for Upstash Redis:
 *   await redis.set(`sso:${token}`, JSON.stringify(data), { ex: 300 })
 */
const ssoTokenStore = new Map<
  string,
  { createdAt: number; used: boolean; source: string }
>()

/**
 * Called by the login-url route to register a new token.
 * Both routes live in the same serverless bundle so the Map is shared.
 */
export function registerSSOToken(token: string, source = "hub") {
  ssoTokenStore.set(token, { createdAt: Date.now(), used: false, source })
}

/**
 * POST /api/sso/validate-callback
 *
 * Internal endpoint — called by /sso/callback page (same origin browser request).
 * Validates the one-time token and returns a session token on success.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { token } = body

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Token is required", code: "MISSING_TOKEN" },
        { status: 400 },
      )
    }

    const storedToken = ssoTokenStore.get(token)

    if (!storedToken) {
      return NextResponse.json(
        {
          success: false,
          error: "Token not found or already expired",
          code: "INVALID_TOKEN",
        },
        { status: 401 },
      )
    }

    if (storedToken.used) {
      return NextResponse.json(
        { success: false, error: "Token has already been used", code: "TOKEN_USED" },
        { status: 401 },
      )
    }

    const now = Date.now()
    if (now - storedToken.createdAt > 5 * 60 * 1000) {
      ssoTokenStore.delete(token)
      return NextResponse.json(
        { success: false, error: "Token has expired", code: "TOKEN_EXPIRED" },
        { status: 401 },
      )
    }

    // Mark as used — one-time only
    ssoTokenStore.set(token, { ...storedToken, used: true })

    // Issue a session token compatible with LoginAuthContext
    const sessionToken = btoa(
      `elrace:${now}:${crypto.randomBytes(16).toString("hex")}`,
    )

    return NextResponse.json({
      success: true,
      session_token: sessionToken,
      expires_at: new Date(now + 24 * 60 * 60 * 1000).toISOString(),
      user: {
        username: "elrace",
        role: "admin",
        platform: "elrace-projects",
        source: storedToken.source,
      },
    })
  } catch (error) {
    console.error("[SSO] validate-callback error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error", code: "SERVER_ERROR" },
      { status: 500 },
    )
  }
}
