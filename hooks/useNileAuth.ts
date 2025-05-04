"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

// This hook now returns stub functions since we're only using Supabase
export function useNileAuth() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async () => {
    setError("Nile authentication has been removed. Please use Supabase instead.")
    console.warn("Nile authentication has been removed. Please use Supabase instead.")
  }

  const handleSignUp = async () => {
    setError("Nile authentication has been removed. Please use Supabase instead.")
    console.warn("Nile authentication has been removed. Please use Supabase instead.")
  }

  const handleLogout = async () => {
    console.warn("Nile authentication has been removed. Please use Supabase instead.")
  }

  return {
    user: null,
    isLoading: false,
    error,
    login: handleLogin,
    signUp: handleSignUp,
    logout: handleLogout,
    isAuthenticated: false,
  }
}
