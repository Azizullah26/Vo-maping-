"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/app/contexts/AuthContext"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Shield } from "lucide-react"
import AdminDashboard from "./AdminDashboard"

export default function AdminWrapper() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  // Check if user is already authenticated for admin
  useEffect(() => {
    const adminAuth = localStorage.getItem("admin-authenticated")
    if (adminAuth === "true") {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Simple password check (in production, this should be more secure)
    if (password === "admin123" || password === "alain2024") {
      setIsAuthenticated(true)
      localStorage.setItem("admin-authenticated", "true")
    } else {
      setError("Invalid password")
    }

    setLoading(false)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("admin-authenticated")
    setPassword("")
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <Shield className="mx-auto h-12 w-12 text-blue-600 mb-4" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Access</h1>
              <p className="text-gray-600">Enter password to access admin panel</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    placeholder="Enter admin password"
                    required
                  />
                </div>
              </div>

              {error && <div className="text-red-600 text-sm text-center">{error}</div>}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Authenticating..." : "Access Admin Panel"}
              </Button>
            </form>

            <div className="mt-4 text-xs text-gray-500 text-center">Authorized personnel only</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-blue-600 mr-2" />
              <h1 className="text-lg font-semibold text-gray-900">Al Ain Admin Panel</h1>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Admin Content */}
      <AdminDashboard />
    </div>
  )
}
