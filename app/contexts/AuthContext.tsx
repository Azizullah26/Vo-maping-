"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  user: string | null
}

// Create a default value for the context to avoid undefined
const defaultAuthContext: AuthContextType = {
  isAuthenticated: true, // Always authenticated
  login: async () => false,
  logout: () => {},
  user: "Guest User", // Default user
}

const AuthContext = createContext<AuthContextType>(defaultAuthContext)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true) // Always authenticated
  const [user, setUser] = useState<string | null>("Guest User") // Default user

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login: defaultAuthContext.login, logout: defaultAuthContext.logout, user }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    console.error("useAuth must be used within an AuthProvider")
    return defaultAuthContext
  }
  return context
}
