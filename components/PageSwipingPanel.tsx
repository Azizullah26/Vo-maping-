"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Building, Landmark } from "lucide-react"

interface PageSwipingPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function PageSwipingPanel({ isOpen, onClose }: PageSwipingPanelProps) {
  const router = useRouter()
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
      // Add a class to prevent scrolling when the panel is open
      document.body.classList.add("overflow-hidden")
    } else {
      // Remove the class when the panel is closed
      document.body.classList.remove("overflow-hidden")
    }

    return () => {
      document.body.classList.remove("overflow-hidden")
    }
  }, [isOpen])

  const handleNavigation = (path: string) => {
    onClose()
    router.push(path)
  }

  if (!isOpen && !isAnimating) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
      onClick={onClose}
    >
      <div
        className={cn(
          "absolute bottom-0 left-1/2 -translate-x-1/2 w-11/12 max-w-md bg-gray-900 rounded-t-3xl transition-transform duration-300 ease-in-out transform",
          isOpen ? "translate-y-0" : "translate-y-full",
        )}
        onClick={(e) => e.stopPropagation()}
        onTransitionEnd={() => {
          if (!isOpen) setIsAnimating(false)
        }}
      >
        {/* Handle/Drag indicator */}
        <div className="flex justify-center pt-2 pb-4">
          <div className="w-12 h-1 bg-gray-600 rounded-full"></div>
        </div>

        <div className="px-4 pb-8 max-w-xs mx-auto w-full">
          <h3 className="text-white text-lg font-medium mb-4 text-center">Cities</h3>

          <div className="flex flex-col space-y-3 w-full max-w-sm mx-auto">
            <Button
              variant="outline"
              size="lg"
              className="flex items-center justify-start px-6 py-4 bg-black/50 border-gray-700 hover:bg-gray-800 hover:border-gray-600 hover:scale-102 transition-all"
              onClick={() => handleNavigation("/abu-dhabi")}
            >
              <Landmark className="h-6 w-6 mr-4 text-red-500" />
              <span className="text-white text-lg">Abu Dhabi</span>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="flex items-center justify-start px-6 py-4 bg-black/50 border-gray-700 hover:bg-gray-800 hover:border-gray-600 hover:scale-102 transition-all"
              onClick={() => handleNavigation("/")}
            >
              <Building className="h-6 w-6 mr-4 text-blue-500" />
              <span className="text-white text-lg">Al Ain</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
