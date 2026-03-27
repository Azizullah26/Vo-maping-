"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useLoginAuth } from "@/app/contexts/LoginAuthContext"

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useLoginAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Public paths that don't require authentication
  const publicPaths = ["/login", "/sso/callback", "/sso/docs"]

  useEffect(() => {
    // Add listener for SSO auth state changes
    const handleAuthChange = () => {
      // The context will handle the update automatically
    }

    window.addEventListener("storage", handleAuthChange)
    return () => {
      window.removeEventListener("storage", handleAuthChange)
    }
  }, [])

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !publicPaths.includes(pathname)) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, pathname, router])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  // If not authenticated and not on a public path, don't render children
  if (!isAuthenticated && !publicPaths.includes(pathname)) {
    return null
  }

  return <>{children}</>
}
