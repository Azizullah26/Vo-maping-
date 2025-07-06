"use client"

import type React from "react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLoginAuth } from "@/app/contexts/LoginAuthContext"
import { Eye, EyeOff, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState("")
  const [animateIn, setAnimateIn] = useState(false)
  const { login, isLoading, error } = useLoginAuth()
  const router = useRouter()

  useEffect(() => {
    // Trigger animations after component mounts
    setAnimateIn(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")

    // Basic validation
    if (!username.trim() || !password.trim()) {
      setFormError("Please enter both username and password")
      return
    }

    const success = await login(username, password, rememberMe)
    if (success) {
      router.push("/welcome")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Image with Animation */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 to-blue-900/80 z-10"></div>
        <Image
          src="/images/uae-dubai-map-bg.png"
          alt="UAE Dubai Map Background"
          fill
          className="object-cover"
          priority
        />

        {/* Animated Particles */}
        <div className="absolute inset-0 z-20">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute rounded-full bg-cyan-400 opacity-0 animate-float-particle`}
              style={{
                width: `${Math.random() * 6 + 2}px`,
                height: `${Math.random() * 6 + 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 15}s`,
              }}
            ></div>
          ))}
        </div>

        {/* Animated Network Lines */}
        <div className="absolute inset-0 z-20">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent h-px opacity-0 animate-network-line"
              style={{
                width: "100%",
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 20}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      <div
        className={`w-full max-w-md z-30 transition-all duration-1000 transform ${animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
      >
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div
            className={`inline-block mb-4 transition-all duration-1000 delay-300 transform ${animateIn ? "translate-y-0 opacity-100 rotate-0" : "translate-y-10 opacity-0 rotate-12"}`}
          >
            <Image
              src="/images/elrace-logo.png"
              alt="El Race Contracting Logo"
              width={120}
              height={120}
              className="rounded-lg shadow-lg shadow-cyan-500/20"
              priority
            />
          </div>
          <h1
            className={`text-3xl font-bold text-white mb-2 transition-all duration-700 delay-500 ${animateIn ? "opacity-100" : "opacity-0"}`}
          >
            ELRACE Projects
          </h1>
          <p
            className={`text-gray-300 transition-all duration-700 delay-700 ${animateIn ? "opacity-100" : "opacity-0"}`}
          >
            Sign in to access
          </p>
        </div>

        {/* Login Form */}
        <div
          className={`bg-white/10 backdrop-blur-md rounded-xl shadow-xl overflow-hidden transition-all duration-1000 delay-900 transform ${animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              {/* Error Messages */}
              {(error || formError) && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-red-100 text-sm">{formError || error}</span>
                </div>
              )}

              {/* Username Field */}
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-200 mb-1">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 bg-white/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                  placeholder="Enter your username"
                  disabled={isLoading}
                  autoComplete="username"
                />
              </div>

              {/* Password Field */}
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-white/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                    placeholder="Enter your password"
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center mb-6">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-cyan-500 focus:ring-cyan-500 border-gray-600 rounded bg-gray-700"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                  Remember me for 30 days
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
      </div>

      {/* Footer - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-20 pb-4">
        <div
          className={`text-center transition-all duration-700 delay-1100 ${animateIn ? "opacity-100" : "opacity-0"}`}
        >
          <p className="text-sm text-gray-400 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg mx-auto inline-block">
            &copy; {new Date().getFullYear()} ELRACE Projects. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
