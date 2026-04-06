import { type NextRequest, NextResponse } from "next/server"

/**
 * Auth Callback Handler
 * This handles OAuth/SSO callbacks from Supabase Auth and other providers
 * Ensures users are redirected to the home page after successful authentication
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    // Check for Supabase auth code (OAuth callback)
    const code = searchParams.get("code")
    const state = searchParams.get("state")
    const error = searchParams.get("error")
    const error_description = searchParams.get("error_description")

    // Log for debugging
    console.log("[v0] Auth callback:", { code: !!code, state, error, error_description })

    // If there's an error in the OAuth flow, redirect to login
    if (error) {
      console.error("[v0] Auth error:", error, error_description)
      return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error)}`, request.url))
    }

    // If we have a code, the Supabase client on the frontend will handle it
    // Just redirect to home page
    if (code) {
      return NextResponse.redirect(new URL("/", request.url))
    }

    // Default: redirect to home
    return NextResponse.redirect(new URL("/", request.url))
  } catch (error) {
    console.error("[v0] Auth callback error:", error)
    return NextResponse.redirect(new URL("/", request.url))
  }
}
