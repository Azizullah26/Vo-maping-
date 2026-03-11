import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { consumeSSOToken } from "@/app/api/sso/validate-callback/route"

/**
 * POST /api/sso/verify
 *
 * Hub-to-platform server-side verification (optional step).
 * Call this from your hub backend after the browser callback to confirm
 * the token was valid and to receive session details.
 *
 * Request body:
 *   { api_key: string, token: string }
 *
 * Response:
 *   { success: true, session_token: string, expires_at: string, user: object }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { api_key, token } = body

    // ── API key validation ────────────────────────────────────────────────
    const validApiKey = process.env.SSO_API_KEY || "elrace-sso-key-2024"
    if (!api_key || api_key !== validApiKey) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing API key", code: "INVALID_API_KEY" },
        { status: 401 },
      )
    }

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Token is required", code: "MISSING_TOKEN" },
        { status: 400 },
      )
    }

    // ── Consume from the shared token store ───────────────────────────────
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

/**
 * GET /api/sso/verify — quick documentation
 */
export async function GET() {
  return NextResponse.json({
    endpoint: "POST /api/sso/verify",
    description:
      "Optional hub-to-platform server-side verification. Confirms the token was valid and returns session details.",
    authentication: "API key in request body",
    request_body: {
      api_key: "string (required) — your SSO API key",
      token: "string (required) — the one-time token from the login_url",
    },
    response: {
      success: true,
      session_token: "string",
      expires_at: "ISO 8601",
      user: { username: "elrace", role: "admin", platform: "elrace-projects", source: "hub" },
      message: "Authentication successful",
    },
  })
}
