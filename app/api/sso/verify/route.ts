import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import crypto from "crypto"

// Shared token store (same module-level Map as login-url route)
// In production, use Redis or a database
const ssoTokenStore = new Map<string, { createdAt: number; used: boolean; source: string }>()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { token, api_key } = body

    // Validate API key
    const validApiKey = process.env.SSO_API_KEY || "elrace-sso-key-2024"
    if (api_key !== validApiKey) {
      return NextResponse.json(
        { success: false, error: "Invalid API key", code: "INVALID_API_KEY" },
        { status: 401 },
      )
    }

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Token is required", code: "MISSING_TOKEN" },
        { status: 400 },
      )
    }

    const storedToken = ssoTokenStore.get(token)

    if (!storedToken) {
      return NextResponse.json(
        { success: false, error: "Token not found or expired", code: "INVALID_TOKEN" },
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

    // Mark token as used (one-time use)
    ssoTokenStore.set(token, { ...storedToken, used: true })

    // Generate session token
    const sessionToken = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date(now + 24 * 60 * 60 * 1000).toISOString() // 24 hours

    return NextResponse.json({
      success: true,
      session_token: sessionToken,
      expires_at: expiresAt,
      user: {
        username: "elrace",
        role: "admin",
        platform: "elrace-projects",
      },
      message: "Authentication successful",
    })
  } catch (error) {
    console.error("[SSO] verify error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error", code: "SERVER_ERROR" },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: "POST /api/sso/verify",
    description: "Verify a one-time SSO token after user authentication",
    required_body: {
      token: "string — the one-time token from login_url",
      api_key: "string — your SSO API key",
    },
    response: {
      success: true,
      session_token: "<session_token>",
      expires_at: "ISO 8601 timestamp",
      user: {
        username: "string",
        role: "string",
        platform: "string",
      },
    },
  })
}
