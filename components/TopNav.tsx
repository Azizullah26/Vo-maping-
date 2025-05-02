"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Building2, Filter, Home, Building, Warehouse, Shield } from "lucide-react"
import styles from "@/styles/nav-button.module.css"
import glowStyles from "@/styles/glow-button.module.css"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const navigationItems = [
  {
    title: "Map",
    icon: MapPin,
    href: "/",
  },
]

const projectItem = {
  title: "Projects",
  icon: Building2,
  href: "/projects",
}

const filterButtons = [
  { id: "villa", label: "VILLA", icon: Home },
  { id: "stations", label: "STATIONS", icon: Building },
  { id: "buildings", label: "BUILDINGS", icon: Warehouse },
]

interface NavLinkProps {
  href: string
  children: React.ReactNode
}

const NavLink = ({ href, children }: NavLinkProps) => {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link href={href} className={`${styles.button} ${isActive ? styles.active : ""}`}>
      {children}
    </Link>
  )
}

// Update the TopNavProps interface to include onAdminClick
interface TopNavProps {
  onToggleProjects?: () => void
  showProjects?: boolean
  onAdminClick?: () => void
  showAdmin?: boolean
}

// Update the TopNav component to include the admin button
export function TopNav({ onToggleProjects, showProjects, onAdminClick, showAdmin }: TopNavProps) {
  const pathname = usePathname()
  const isAlAinPage = pathname === "/al-ain"
  const [showFilters, setShowFilters] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<Record<string, boolean>>({})

  const handleFilterChange = (categoryName: string, filterId: string) => {
    setSelectedFilters((current) => ({
      ...current,
      [filterId]: !current[filterId],
    }))
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-white/10">
        <div className="w-full max-w-[2000px] mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between min-h-[3.5rem] sm:min-h-[4rem] md:min-h-[4.5rem]">
            {/* Left section */}
            <div className="flex items-center gap-x-2 sm:gap-x-3 md:gap-x-4">
              <Link
                href="/"
                className={cn("flex items-center gap-x-4", "rounded-md transition-transform duration-200")}
              >
                {isAlAinPage ? (
                  // Special styling for Al Ain page logo
                  <div className="logo-container-alain">
                    <div className="logo-inner">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/remove%20bg%20rcc-police-logo-animation--2LfRrKuENgA7jmdeasfaIkgAiw4m3V.gif"
                        alt="RCC Logo"
                        width={60}
                        height={60}
                        className="logo-image"
                        priority
                      />
                    </div>
                    <div className="logo-glow"></div>
                  </div>
                ) : (
                  // Default logo for other pages
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/abu-dhabi-police-logo-21AF543362-nwLnkElCePIGxnmxG49FlWYFtViagS.png"
                    alt="Abu Dhabi Police Logo"
                    width={60}
                    height={60}
                    className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain"
                    priority
                  />
                )}
                {isAlAinPage && (
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-base sm:text-lg md:text-xl">AL AIN POLICE</span>
                    <span className="text-white/70 text-sm sm:text-base md:text-lg font-semibold">شرطة العين</span>
                  </div>
                )}
              </Link>
              <nav className="flex items-center">
                <ul className="flex items-center gap-x-1 sm:gap-x-2 md:gap-x-3">
                  {navigationItems.map((item) => (
                    <li key={item.title}>
                      <Link
                        href={item.href}
                        className={cn(
                          styles.btn,
                          glowStyles.glowOnHover,
                          "flex items-center gap-x-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2",
                          "text-white transition-colors text-xs sm:text-sm md:text-base",
                          "rounded-md",
                        )}
                      >
                        <item.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 flex-shrink-0" />
                        <span className="hidden xs:inline">{item.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Center section - New Project Links */}
            <div className="flex items-center gap-x-6 absolute left-1/2 transform -translate-x-1/2">
              <Link
                href="#"
                className={cn(
                  "text-white transition-colors text-sm sm:text-base font-medium",
                  glowStyles.glowOnHover,
                  "px-3 py-1.5 rounded-md",
                )}
              >
                Construction Project
              </Link>
              <Link
                href="#"
                className={cn(
                  "text-white transition-colors text-sm sm:text-base font-medium",
                  glowStyles.glowOnHover,
                  "px-3 py-1.5 rounded-md",
                )}
              >
                Maintenance Project
              </Link>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-x-2">
              {/* Filter button - Only show on Al Ain page */}
              {isAlAinPage && (
                <>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={cn(
                      styles.btn,
                      glowStyles.glowOnHover,
                      "flex items-center gap-x-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2",
                      "text-white transition-colors text-xs sm:text-sm md:text-base",
                      "rounded-md",
                      showFilters && "bg-white/20",
                    )}
                  >
                    <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 flex-shrink-0" />
                    <span className="hidden xs:inline">Filter</span>
                  </button>
                  {/* Add Admin Button */}
                  <button
                    onClick={onAdminClick}
                    className={cn(
                      styles.btn,
                      glowStyles.glowOnHover,
                      "flex items-center gap-x-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2",
                      "text-white transition-colors text-xs sm:text-sm md:text-base",
                      "rounded-md",
                      showAdmin ? "bg-[#E31E24]/30 border border-[#E31E24]/50" : "",
                    )}
                  >
                    <Shield
                      className={`h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 flex-shrink-0 ${showAdmin ? "text-[#E31E24]" : ""}`}
                    />
                    <span className="hidden xs:inline">Summary</span>
                  </button>
                </>
              )}
              {!isAlAinPage && (
                <Link
                  href={projectItem.href}
                  className={cn(
                    styles.btn,
                    glowStyles.glowOnHover,
                    "flex items-center gap-x-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2",
                    "text-white transition-colors text-xs sm:text-sm md:text-base",
                    "rounded-md",
                  )}
                >
                  <projectItem.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 flex-shrink-0" />
                  <span className="hidden xs:inline">{projectItem.title}</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filter buttons row */}
      {isAlAinPage && showFilters && (
        <div
          className={cn(
            "fixed top-[3.5rem] sm:top-16 md:top-[4.5rem] left-0 right-0 z-40",
            "transform transition-all duration-200 ease-in-out",
            showFilters ? "translate-y-0" : "-translate-y-full",
          )}
        >
          <div className="w-full max-w-[2000px] mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-2">
            <div className="flex items-center gap-3 justify-center">
              {filterButtons.map((button) => {
                const Icon = button.icon
                return (
                  <Button
                    key={button.id}
                    variant="ghost"
                    className={cn(
                      glowStyles.glowOnHover,
                      "text-white",
                      "border border-white/20 rounded-md px-6",
                      "transition-colors duration-200",
                      "flex items-center gap-2",
                      selectedFilters[button.id] ? "bg-white text-black hover:text-black" : "",
                    )}
                    onClick={() => handleFilterChange("category", button.id)}
                  >
                    <Icon className={cn("h-4 w-4", selectedFilters[button.id] ? "text-black" : "text-white")} />
                    {button.label}
                  </Button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default TopNav
