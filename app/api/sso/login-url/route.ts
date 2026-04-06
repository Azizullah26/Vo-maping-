import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { provider, apiKey, source } = body

    console.log("[v0] SSO /login-url endpoint called")
    console.log("[v0] SSO Request - API Key:", apiKey ? "provided" : "missing", "Source:", source || "not specified")

    // If an API key is provided, this is coming from an external source (hub)
    if (apiKey && source) {
      // Call the hub's SSO login endpoint to get the actual redirect URL
      try {
        const hubUrl = process.env.NEXT_PUBLIC_HUB_URL || "https://elarcehub.site"
        const redirectUrl = `${request.headers.get("origin") || process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL || "https://elracemap.vercel.app"}/auth/callback`
        
        console.log("[v0] Calling hub SSO endpoint:", `${hubUrl}/api/elrace-map/sso/login`)
        
        const hubResponse = await fetch(`${hubUrl}/api/elrace-map/sso/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            apiKey,
            source,
            provider: provider || "default",
            redirectUrl,
          }),
        })

        if (!hubResponse.ok) {
          console.error("[v0] Hub SSO endpoint error:", hubResponse.status, hubResponse.statusText)
          const errorText = await hubResponse.text()
          console.error("[v0] Hub error response:", errorText)
          return NextResponse.json(
            { error: `Hub endpoint error: ${hubResponse.statusText}` },
            { status: hubResponse.status }
          )
        }

        const hubData = await hubResponse.json()
        console.log("[v0] SSO: Generated login URL for source:", source, "and login now")
        
        return NextResponse.json({
          success: true,
          redirectUrl: hubData.redirectUrl || hubData.loginUrl,
          provider: provider || "default",
          source: source,
        })
      } catch (hubError) {
        console.error("[v0] Error calling hub SSO endpoint:", hubError)
        return NextResponse.json(
          { error: "Failed to communicate with SSO hub", details: String(hubError) },
          { status: 502 }
        )
      }
    }

    // If no API key, generate a simple redirect URL to home
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL || "https://elracemap.vercel.app"
    const redirectUrl = `${origin}/auth/callback?redirectTo=${encodeURIComponent("/")}`

    console.log("[v0] SSO: No API key provided, returning local redirect URL")
    
    return NextResponse.json({
      success: true,
      redirectUrl: redirectUrl,
      provider: provider || "default",
    })
  } catch (error) {
    console.error("[v0] SSO login URL error:", error)
    return NextResponse.json(
      { error: "Failed to generate SSO login URL", details: String(error) },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const provider = request.nextUrl.searchParams.get("provider") || "default"
    const apiKey = request.nextUrl.searchParams.get("apiKey")
    const source = request.nextUrl.searchParams.get("source")

    console.log("[v0] SSO /login-url endpoint called (GET)")
    console.log("[v0] SSO Request - API Key:", apiKey ? "provided" : "missing", "Source:", source || "not specified")

    // If an API key is provided, this is coming from an external source (hub)
    if (apiKey && source) {
      try {
        const hubUrl = process.env.NEXT_PUBLIC_HUB_URL || "https://elarcehub.site"
        const redirectUrl = `${request.headers.get("origin") || process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL || "https://elracemap.vercel.app"}/auth/callback`
        
        console.log("[v0] Calling hub SSO endpoint:", `${hubUrl}/api/elrace-map/sso/login`)
        
        const hubResponse = await fetch(`${hubUrl}/api/elrace-map/sso/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            apiKey,
            source,
            provider,
            redirectUrl,
          }),
        })

        if (!hubResponse.ok) {
          console.error("[v0] Hub SSO endpoint error:", hubResponse.status, hubResponse.statusText)
          const errorText = await hubResponse.text()
          console.error("[v0] Hub error response:", errorText)
          return NextResponse.json(
            { error: `Hub endpoint error: ${hubResponse.statusText}` },
            { status: hubResponse.status }
          )
        }

        const hubData = await hubResponse.json()
        console.log("[v0] SSO: Generated login URL for source:", source, "and login now")

        return NextResponse.json({
          success: true,
          redirectUrl: hubData.redirectUrl || hubData.loginUrl,
          provider,
          source,
        })
      } catch (hubError) {
        console.error("[v0] Error calling hub SSO endpoint:", hubError)
        return NextResponse.json(
          { error: "Failed to communicate with SSO hub", details: String(hubError) },
          { status: 502 }
        )
      }
    }

    // If no API key, generate a simple redirect URL to home
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL || "https://elracemap.vercel.app"
    const redirectUrl = `${origin}/auth/callback?redirectTo=${encodeURIComponent("/")}`

    console.log("[v0] SSO: No API key provided, returning local redirect URL")

    return NextResponse.json({
      success: true,
      redirectUrl: redirectUrl,
      provider,
    })
  } catch (error) {
    console.error("[v0] SSO login URL error:", error)
    return NextResponse.json(
      { error: "Failed to generate SSO login URL", details: String(error) },
      { status: 500 }
    )
  }
}
