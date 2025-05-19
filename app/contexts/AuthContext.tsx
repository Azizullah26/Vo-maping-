"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"

interface AuthContextType {
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  user: string | null
}

// Create a default value for the context to avoid undefined
const defaultAuthContext: AuthContextType = {
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
  user: null,
}

const AuthContext = createContext<AuthContextType>(defaultAuthContext)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if running in browser environment
    if (typeof window !== "undefined") {
      try {
        // Check if user is authenticated from cookie
        const authCookie = Cookies.get("auth")
        if (authCookie) {
          try {
            const userData = JSON.parse(authCookie)
            setIsAuthenticated(true)
            setUser(userData.username)

            // Simulate database check
            console.log("User authenticated from stored session:", userData.username)
          } catch (e) {
            console.error("Error parsing auth cookie:", e)
            Cookies.remove("auth")
          }
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
      }
    }
  }, [])

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    try {
      // In a real application, you would validate credentials against a database
      if (username === "elrace" && password === "elrace1122") {
        // Simulate database storage
        console.log("Storing authentication in database for user:", username)

        // Set local state
        setIsAuthenticated(true)
        setUser(username)

        // Set authentication cookie with 7 day expiry
        Cookies.set(
          "auth",
          JSON.stringify({
            username,
            loginTime: new Date().toISOString(),
            // In a real app, you would store a token here, not the password
          }),
          {
            expires: 7,
            secure: true,
            sameSite: "strict",
          },
        )

        return true
      }
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }, [])

  const logout = useCallback(() => {
    try {
      // Simulate removing from database
      console.log("Removing authentication from database for user:", user)

      // Clear local state
      setIsAuthenticated(false)
      setUser(null)

      // Remove cookie
      Cookies.remove("auth")

      // Redirect to login
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }, [router, user])

  return <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    console.error("useAuth must be used within an AuthProvider")
    return defaultAuthContext
  }
  return context
}
