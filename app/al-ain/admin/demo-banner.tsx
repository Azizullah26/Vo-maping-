"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { X, Info } from "lucide-react"

export default function DemoBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDemoMode, setIsDemoMode] = useState(false)

  useEffect(() => {
    // Check if we're in demo mode
    const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true"
    setIsDemoMode(demoMode)

    // Check if banner was previously dismissed
    const dismissed = localStorage.getItem("demo-banner-dismissed")
    setIsVisible(demoMode && !dismissed)
  }, [])

  const dismissBanner = () => {
    setIsVisible(false)
    localStorage.setItem("demo-banner-dismissed", "true")
  }

  if (!isVisible || !isDemoMode) {
    return null
  }

  return (
    <Alert className="mb-4 border-blue-200 bg-blue-50">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertDescription className="flex items-center justify-between">
        <span className="text-blue-800">
          <strong>Demo Mode:</strong> You are viewing a demonstration version of the Al Ain Admin Panel. Some features
          may be limited or simulated.
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={dismissBanner}
          className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
        >
          <X className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  )
}
