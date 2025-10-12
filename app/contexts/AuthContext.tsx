"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated")
    if (storedAuth === "true") {
      setIsAuthenticated(true)
    }
  }, [])

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    // In a real application, you would validate credentials against a backend
    if (username === "ELRACE" && password === "EL1234") {
      setIsAuthenticated(true)
      localStorage.setItem("isAuthenticated", "true")
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    setIsAuthenticated(false)
    localStorage.removeItem("isAuthenticated")
  }, [])

  return <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
