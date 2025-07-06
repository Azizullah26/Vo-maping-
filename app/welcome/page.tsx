"use client"

import { useLoginAuth } from "@/app/contexts/LoginAuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { CheckCircle, ArrowRight } from "lucide-react"

export default function WelcomePage() {
  const { user, isAuthenticated } = useLoginAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }

    // Auto-redirect to main page after 3 seconds
    const timer = setTimeout(() => {
      router.push("/")
    }, 3000)

    return () => clearTimeout(timer)
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-green-500/20 p-3">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">Welcome, {user.name}!</h1>
        <p className="text-gray-300 mb-8">
          You have successfully logged in to the ELRACE Projects dashboard. You will be redirected to the main page
          shortly.
        </p>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-300 text-sm">Status</span>
            <span className="text-green-400 text-sm font-medium">Active</span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-300 text-sm">Account</span>
            <span className="text-white text-sm">{user.email}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">Role</span>
            <span className="text-white text-sm">Administrator</span>
          </div>
        </div>

        <button
          onClick={() => router.push("/")}
          className="inline-flex items-center px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
        >
          Continue to Dashboard
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
