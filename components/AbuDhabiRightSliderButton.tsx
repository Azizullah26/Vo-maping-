"use client"

import { Button } from "@/components/ui/button"
import { Building2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { JSX } from "react"

interface AbuDhabiRightSliderButtonProps {
  isOpen: boolean
  onClick: () => void
}

export const AbuDhabiRightSliderButton = ({ isOpen, onClick }: AbuDhabiRightSliderButtonProps): JSX.Element => {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "fixed top-1/2 right-4 transform -translate-y-1/2 z-50 p-3 bg-[#1B1464] text-white backdrop-blur-sm rounded-full border-2 border-[#E31E24] hover:bg-[#1B1464]/80 transition-all duration-300 flex items-center justify-center shadow-[0_0_15px_rgba(227,30,36,0.7)]",
        isOpen ? "right-[280px]" : "",
      )}
      aria-label={isOpen ? "Hide Projects" : "Show Projects"}
    >
      <Building2 className={cn("h-6 w-6", isOpen ? "" : "animate-pulse")} />
    </Button>
  )
}

export default AbuDhabiRightSliderButton
