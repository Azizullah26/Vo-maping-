"use client"

import { useNileAuth as useNileAuthBase, useNileUser } from "@niledatabase/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function useNileAuth() {
  const { login, logout, signUp } = useNileAuthBase()
  const { user, isLoading } = useNileUser()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Clear error when user changes
  useEffect(() => {
    setError(null)
  }, [user])

  const handleLogin = async (email: string, password: string) => {
    try {
      setError(null)
      await login(email, password)
      router.push("/dashboard")
    } catch (err) {
      console.error("Login error:", err)
      setError(err instanceof Error ? err.message : "Failed to login")
    }
  }

  const handleSignUp = async (email: string, password: string, name: string) => {
    try {
      setError(null)
      await signUp(email, password, { name })
      router.push("/dashboard")
    } catch (err) {
      console.error("Signup error:", err)
      setError(err instanceof Error ? err.message : "Failed to sign up")
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/login")
    } catch (err) {
      console.error("Logout error:", err)
    }
  }

  return {
    user,
    isLoading,
    error,
    login: handleLogin,
    signUp: handleSignUp,
    logout: handleLogout,
    isAuthenticated: !!user,
  }
}
