import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

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
 * Called by /api/sso/login-url to register a new token.
 */
export function registerSSOToken(token: string, source = "hub") {
  ssoTokenStore.set(token, { createdAt: Date.now(), used: false, source })
}

/**
 * Called by /api/sso/verify to consume a token and return session data.
 * Returns null if the token is invalid, expired, or already used.
 */
export function consumeSSOToken(token: string): {
  sessionToken: string
  expiresAt: string
  source: string
} | { error: string; code: string } {
  const stored = ssoTokenStore.get(token)

  if (!stored) return { error: "Token not found or already expired", code: "INVALID_TOKEN" }
  if (stored.used) return { error: "Token has already been used", code: "TOKEN_USED" }
  if (Date.now() - stored.createdAt > 5 * 60 * 1000) {
    ssoTokenStore.delete(token)
    return { error: "Token has expired", code: "TOKEN_EXPIRED" }
  }

  ssoTokenStore.set(token, { ...stored, used: true })

  const now = Date.now()
  const sessionToken = btoa(`elrace:${now}:${Math.random().toString(36).slice(2)}`)
  const expiresAt = new Date(now + 24 * 60 * 60 * 1000).toISOString()

  return { sessionToken, expiresAt, source: stored.source }
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

    const result = consumeSSOToken(token)

    if ("error" in result) {
      return NextResponse.json(
        { success: false, error: result.error, code: result.code },
        { status: 401 },
      )
    }

    return NextResponse.json({
      success: true,
      session_token: result.sessionToken,
      expires_at: result.expiresAt,
      user: {
        username: "elrace",
        role: "admin",
        platform: "elrace-projects",
        source: result.source,
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
