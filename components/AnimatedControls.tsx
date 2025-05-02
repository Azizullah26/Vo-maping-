"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { MapIcon as Map3D } from "lucide-react"

interface AnimatedControlsProps {
  onResetView: () => void
  onToggleTerrain: () => void
}

export function AnimatedControls({ onResetView, onToggleTerrain }: AnimatedControlsProps) {
  const controlsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Dynamic import of anime.js to avoid MIME type issues
    import("animejs")
      .then((animeModule) => {
        const anime = animeModule.default

        // Initial entrance animation
        if (controlsRef.current) {
          anime({
            targets: controlsRef.current.children,
            translateY: [-20, 0],
            opacity: [0, 1],
            delay: anime.stagger(100),
            easing: "spring(1, 80, 10, 0)",
            duration: 800,
          })
        }
      })
      .catch((err) => {
        console.warn("Could not load animation library:", err)
        // Make sure elements are visible even if animation fails
        if (controlsRef.current) {
          Array.from(controlsRef.current.children).forEach((child) => {
            ;(child as HTMLElement).style.opacity = "1"
          })
        }
      })
  }, [])

  const handleButtonClick = (callback: () => void) => {
    return () => {
      // Button click animation with fallback
      const clickedButton = controlsRef.current?.querySelector(".clicked-button")

      // Simple CSS animation fallback
      if (clickedButton) {
        clickedButton.classList.add("button-click-animation")
        setTimeout(() => {
          clickedButton.classList.remove("button-click-animation")
          callback()
        }, 300)
      } else {
        // If no element found, just call the callback
        callback()
      }
    }
  }

  return (
    <>
      <style jsx global>{`
        .button-click-animation {
          transform: scale(0.95);
          transition: transform 0.15s ease;
        }
      `}</style>
      <div ref={controlsRef} className="fixed top-4 right-4 z-10 flex flex-col sm:flex-row gap-2">
        <Button
          className="clicked-button bg-black/70 hover:bg-black/80 text-white shadow-lg backdrop-blur-sm w-10 h-10 sm:w-auto sm:h-auto p-0 sm:p-2 transition-transform"
          onClick={handleButtonClick(onResetView)}
          title="Reset view"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          <span className="hidden sm:inline ml-2">Reset View</span>
        </Button>
        <Button
          className="clicked-button bg-black/70 hover:bg-black/80 text-white shadow-lg backdrop-blur-sm transition-transform"
          onClick={handleButtonClick(onToggleTerrain)}
        >
          <Map3D className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">View 3D Terrain</span>
        </Button>
      </div>
    </>
  )
}
