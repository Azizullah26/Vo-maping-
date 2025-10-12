"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ErrorBoundary } from "react-error-boundary"
// Import robot scene dynamically
const RobotSpline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-200 animate-pulse" />,
})

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [robotError, setRobotError] = useState(false)
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === "ELRACE" && password === "EL1234") {
      sessionStorage.setItem("isAuthenticated", "true")
      router.push("/")
    } else {
      setError("Invalid username or password")
    }
  }

  const handleRobotError = () => {
    console.error("Failed to load robot scene")
    setRobotError(true)
  }

  function ErrorFallback({ error }: { error: Error }) {
    return (
      <div className="text-red-500 text-center">
        <p>Something went wrong:</p>
        <pre>{error.message}</pre>
      </div>
    )
  }

  return (
    <div className="relative w-full h-screen overflow-hidden flex">
      <div className="w-1/2 h-full relative">
        {!robotError ? (
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <RobotSpline
              scene="https://prod.spline.design/PI-HXdRNl0O-u9ie/scene.splinecode"
              onError={handleRobotError}
            />
          </ErrorBoundary>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600" />
        )}
      </div>
      <div className="w-1/2 h-full flex items-center justify-center">
        <div className="w-full max-w-md space-y-8">
          <div className="flex justify-center">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/our%20main%20logo%202025-01-Qfxvimv60zcUduv8DZzSRzoS6qKX09.png"
              alt="El Race Contracting Logo"
              width={300}
              height={150}
              priority
              className="mb-8"
            />
          </div>
          <Card className="bg-white/5 backdrop-blur-md border-0 shadow-2xl">
            <CardHeader className="pb-4">
              <div className="w-full h-1 bg-gradient-to-r from-[#E31E24] to-[#1B1464] rounded-full mb-4" />
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium text-white">
                    Username
                  </label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-white/10 border-0 rounded-md text-black placeholder-gray-500 focus:ring-2 focus:ring-[#E31E24]"
                    placeholder="Enter your username"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-white">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-white/10 border-0 rounded-md text-black placeholder-gray-500 focus:ring-2 focus:ring-[#E31E24]"
                    placeholder="Enter your password"
                  />
                </div>
                {error && <p className="text-[#E31E24] text-sm font-medium">{error}</p>}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#E31E24] to-[#1B1464] hover:opacity-90 text-white border-0"
                >
                  Login
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
