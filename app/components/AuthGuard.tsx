"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useLoginAuth } from "@/app/contexts/LoginAuthContext"

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useLoginAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [hasTimedOut, setHasTimedOut] = useState(false)

  // Set timeout for loading state - if it takes more than 5 seconds, assume error
  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => {
        console.warn("[v0] AuthGuard loading timeout - forcing to login page")
        setHasTimedOut(true)
      }, 5000)
      return () => clearTimeout(timeout)
    }
  }, [isLoading])

  useEffect(() => {
    console.log("[v0] AuthGuard state:", { isAuthenticated, isLoading, pathname })
    
    if (!isLoading && !isAuthenticated && pathname !== "/login") {
      console.log("[v0] Redirecting to login")
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, pathname, router])

  // Show loading state but with timeout protection
  if (isLoading && !hasTimedOut) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
          <p className="text-xs text-gray-400 mt-2">If this takes too long, refresh the page</p>
        </div>
      </div>
    )
  }

  // If timed out or not authenticated and not on login page, don't render children
  if ((hasTimedOut || !isAuthenticated) && pathname !== "/login") {
    return null
  }

  return <>{children}</>
}
