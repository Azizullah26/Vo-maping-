"use client"

import { useEffect, useRef } from "react"
import { Compass } from "lucide-react"

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
      <div className="absolute top-24 right-4 z-10 flex flex-col gap-2 transform scale-100 sm:scale-100 origin-top-right">
        <button
          onClick={onResetView}
          className="bg-white/80 hover:bg-white text-gray-800 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105"
          aria-label="Reset view"
        >
          <Compass className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </div>
    </>
  )
}
