import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import crypto from "crypto"
import { registerSSOToken } from "@/app/api/sso/validate-callback/route"

/**
 * POST /api/sso/login-url
 *
 * Hub calls this endpoint to obtain a one-time login_url.
 * The hub then redirects the user's browser to that URL.
 *
 * Request body:
 *   { api_key: string, redirect_url?: string, source?: string }
 *
 * Response:
 *   { success: true, login_url: string, token: string, expires_at: string, expires_in_seconds: 300 }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { api_key, redirect_url, source = "hub" } = body

    // ── API key validation ──────────────────────────────────────────────────
    const validApiKey = process.env.SSO_API_KEY || "elrace-sso-key-2024"
    if (!api_key || api_key !== validApiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid or missing API key",
          code: "INVALID_API_KEY",
        },
        { status: 401 },
      )
    }

    // ── Generate one-time token ─────────────────────────────────────────────
    const token = crypto.randomBytes(32).toString("hex")

    registerSSOToken(token, source)

    // ── Build login_url ─────────────────────────────────────────────────────
    const proto = request.headers.get("x-forwarded-proto") || "https"
    const host = request.headers.get("host") || ""
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || `${proto}://${host}`

    const callbackBase = redirect_url
      ? redirect_url.replace(/\/$/, "")
      : `${baseUrl}/sso/callback`

    const loginUrl = `${callbackBase}?token=${token}`

    return NextResponse.json({
      success: true,
      login_url: loginUrl,
      token,
      expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      expires_in_seconds: 300,
      message:
        "Redirect the user's browser to login_url. The token is single-use and expires in 5 minutes.",
    })
  } catch (error) {
    console.error("[SSO] login-url error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        code: "SERVER_ERROR",
      },
      { status: 500 },
    )
  }
}

/**
 * GET /api/sso/login-url
 * Returns quick documentation for this endpoint.
 */
export async function GET() {
  return NextResponse.json({
    endpoint: "POST /api/sso/login-url",
    description:
      "Request a one-time SSO login URL. The hub should redirect the user's browser to the returned login_url.",
    authentication: "API key in request body",
    request_body: {
      api_key: "string (required) — your SSO API key",
      redirect_url:
        "string (optional) — custom callback base URL (defaults to https://<app>/sso/callback)",
      source: "string (optional) — identifier of the calling system, e.g. 'hub'",
    },
    response: {
      success: true,
      login_url:
        "https://<app>/sso/callback?token=<one_time_token>  ← redirect user here",
      token: "<one_time_token>",
      expires_at: "ISO 8601 — 5 minutes from now",
      expires_in_seconds: 300,
    },
    flow: [
      "1. Hub calls POST /api/sso/login-url with api_key",
      "2. Hub receives login_url and redirects user browser to it",
      "3. App validates token at /sso/callback page automatically",
      "4. User is authenticated and redirected to /welcome",
    ],
  })
}
