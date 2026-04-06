import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    let provider = "default"
    let redirectTo = "/"

    try {
      const body = await request.json()
      provider = body.provider || "default"
      redirectTo = body.redirectTo || "/"
    } catch (e) {
      // If no valid JSON body, use defaults
    }

    // Get the origin from request headers
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL || "https://elracemap.vercel.app"

    // For SSO, we redirect to the auth callback which then redirects to home
    const redirectUrl = `${origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`

    return NextResponse.json({
      success: true,
      redirectUrl: redirectUrl,
      provider: provider,
    })
  } catch (error) {
    console.error("SSO login URL error:", error)
    return NextResponse.json(
      { error: "Failed to generate SSO login URL" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const provider = request.nextUrl.searchParams.get("provider") || "default"
    const redirectTo = request.nextUrl.searchParams.get("redirectTo") || "/"

    // Get the origin from request headers
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL || "https://elracemap.vercel.app"

    // For SSO, we redirect to the auth callback which then redirects to home
    const redirectUrl = `${origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}&provider=${encodeURIComponent(provider)}`

    return NextResponse.json({
      success: true,
      redirectUrl: redirectUrl,
      provider: provider,
    })
  } catch (error) {
    console.error("SSO login URL error:", error)
    return NextResponse.json(
      { error: "Failed to generate SSO login URL" },
      { status: 500 }
    )
  }
}
