"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"
import { xanoClient } from "@/lib/xano-client"

interface User {
  id: string
  email: string
  name: string
  role: string
  created_at: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: { email: string; password: string; name: string }) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const result = await xanoClient.getCurrentUser()
      if (result.success) {
        setUser(result.data)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await xanoClient.login(email, password)
      if (result.success) {
        setUser(result.data.user)
        return true
      }
      return false
    } catch (error) {
      console.error("Login failed:", error)
      return false
    }
  }

  const register = async (userData: { email: string; password: string; name: string }): Promise<boolean> => {
    try {
      const result = await xanoClient.register(userData)
      return result.success
    } catch (error) {
      console.error("Registration failed:", error)
      return false
    }
  }

  const logout = () => {
    xanoClient.logout()
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useXanoAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useXanoAuth must be used within an AuthProvider")
  }
  return context
}
