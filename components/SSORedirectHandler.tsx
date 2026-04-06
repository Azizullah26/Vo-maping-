"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

/**
 * SSO Redirect Handler Component
 * 
 * This component ensures that after SSO/OAuth login via Supabase Auth,
 * users are redirected to the home page (/) instead of other locations.
 * 
 * Usage: Add this component to your app layout to handle all SSO redirects globally
 */
export function SSORedirectHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check for OAuth callback parameters
    const code = searchParams.get("code")
    const state = searchParams.get("state")
    const error = searchParams.get("error")

    if (error) {
      // On auth error, redirect to login
      console.warn("[v0] SSO Error:", error)
      router.push(`/login?error=${encodeURIComponent(error)}`)
      return
    }

    if (code) {
      // On successful OAuth callback with code
      // Redirect to home after a small delay to allow Supabase session to be established
      const timer = setTimeout(() => {
        router.push("/")
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [searchParams, router])

  return null
}
