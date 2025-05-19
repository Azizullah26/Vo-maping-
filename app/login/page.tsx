"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/app/contexts/AuthContext"

// Login form component
function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Check credentials
      if (username === "elrace" && password === "elrace1122") {
        // Simulate storing in database
        await login(username, password)

        // Redirect to main app
        setTimeout(() => {
          router.push("/")
        }, 1000)
      } else {
        setError("Invalid credentials. Please try again.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-md z-10"
    >
      <div className="backdrop-blur-md bg-black/30 p-8 rounded-xl border border-cyan-500/30 shadow-[0_0_15px_rgba(0,200,255,0.3)]">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">UAE Interactive Map</h1>
          <p className="text-cyan-300 text-sm">Enter your credentials to access the system</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
              Username
            </label>
            <div className="relative">
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border border-cyan-500/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter username"
                required
              />
              <div className="absolute inset-0 border border-cyan-400/0 rounded-md pointer-events-none transition-all duration-300 group-focus-within:border-cyan-400/50 group-focus-within:shadow-[0_0_10px_rgba(0,200,255,0.3)]"></div>
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border border-cyan-500/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter password"
                required
              />
              <div className="absolute inset-0 border border-cyan-400/0 rounded-md pointer-events-none transition-all duration-300 group-focus-within:border-cyan-400/50 group-focus-within:shadow-[0_0_10px_rgba(0,200,255,0.3)]"></div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200 disabled:opacity-50 relative overflow-hidden group"
          >
            <span className="relative z-10">{isLoading ? "Authenticating..." : "Sign In"}</span>
            <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">For demo: Username: elrace, Password: elrace1122</p>
        </div>
      </div>
    </motion.div>
  )
}

// Main login page component
export default function LoginPage() {
  return (
    <div className="flex items-center justify-center w-full h-screen bg-gradient-to-b from-gray-900 to-black overflow-hidden">
      {/* Overlay elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-900/40 to-black pointer-events-none"></div>

      {/* Login form */}
      <LoginForm />

      {/* Decorative elements */}
      <div className="absolute bottom-4 left-4 text-xs text-gray-500">© 2023 UAE Interactive Map | ELRACE Projects</div>
    </div>
  )
}
