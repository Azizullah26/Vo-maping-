"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    // After SSO callback, redirect to home
    // This ensures any SSO provider redirect goes to the correct location
    router.replace("/")
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-center">
        <div className="inline-block">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
        </div>
        <p className="mt-4 text-white">Signing you in...</p>
      </div>
    </div>
  )
}
