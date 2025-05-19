"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Building2, Building, Home, Warehouse } from "lucide-react"
import styles from "@/styles/nav-button.module.css"
import glowStyles from "@/styles/glow-button.module.css"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useState } from "react"

// Add this import for the scrollbar-hide utility
import "tailwind-scrollbar-hide"

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
  const pathname = usePathname() || ""
  const isAlAinPage = pathname === "/al-ain"
  const isDocumentsPage = pathname === "/al-ain/documents" || (pathname && pathname.startsWith("/al-ain/documents/"))
  const isLivePage = pathname === "/al-ain/live"
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
      {/* Simplified top section with just logo, text and map button */}
      <div className="fixed top-0 left-0 z-50 px-2 py-1">
        <div className="flex items-center gap-x-1 sm:gap-x-2 md:gap-x-3">
          <Link
            href="/"
            className={cn("flex items-center gap-x-2 sm:gap-x-3", "rounded-md transition-transform duration-200")}
          >
            {isAlAinPage ? (
              // Special styling for Al Ain page logo
              <div className="logo-container-alain">
                <div className="logo-inner">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/abu-dhabi-police-logo-21AF543362-3m65MtbIg4ridptp8p3WCPp3VaFyE4.png"
                    alt="Abu Dhabi Police Logo"
                    width={40}
                    height={40}
                    className="logo-image w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10"
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
                width={40}
                height={40}
                className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 object-contain"
                priority
              />
            )}
            {isAlAinPage && (
              <div className="flex flex-col">
                <span className="text-white font-bold text-[8px] sm:text-[10px] md:text-xs">AL AIN POLICE</span>
                <span className="text-white/70 text-[6px] sm:text-[8px] md:text-[10px] font-semibold">شرطة العين</span>
              </div>
            )}
          </Link>
          <nav className="flex items-center">
            <ul className="flex items-center gap-x-1 sm:gap-x-2">
              {navigationItems.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className={cn(
                      styles.btn,
                      glowStyles.glowOnHover,
                      "flex items-center gap-x-1 px-2.5 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2",
                      "text-white transition-colors text-[10px] sm:text-xs md:text-sm font-medium",
                      "rounded-md border border-white/30",
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
      </div>

      {/* Filter buttons row - only show when showFilters is true */}
      {isAlAinPage && showFilters && (
        <div
          className={cn(
            "fixed top-[1.75rem] sm:top-[2rem] md:top-[2.25rem] left-0 right-0 z-40",
            "transform transition-all duration-200 ease-in-out",
          )}
        >
          <div className="w-full max-w-[1800px] mx-auto px-1 sm:px-2 md:px-3 lg:px-4 py-1 sm:py-2">
            {/* Mobile view - scrollable horizontal container */}
            <div className="flex items-center overflow-x-auto scrollbar-hide pb-1 justify-start sm:justify-center">
              <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 px-1">
                {filterButtons.map((button) => {
                  const Icon = button.icon
                  return (
                    <Button
                      key={button.id}
                      variant="ghost"
                      className={cn(
                        glowStyles.glowOnHover,
                        "text-white whitespace-nowrap",
                        "border border-white/20 rounded-md min-w-[60px] px-1.5 xs:px-2 sm:px-4 md:px-6 py-0.5 xs:py-1 sm:py-1.5",
                        "transition-colors duration-200",
                        "flex items-center gap-1 sm:gap-2",
                        "text-[8px] xs:text-[10px] sm:text-xs",
                        selectedFilters[button.id] ? "bg-white text-black hover:text-black" : "",
                      )}
                      onClick={() => handleFilterChange("category", button.id)}
                    >
                      <Icon
                        className={cn(
                          "h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-4 sm:w-4",
                          selectedFilters[button.id] ? "text-black" : "text-white",
                        )}
                      />
                      {button.label}
                    </Button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigation - hide on documents page */}
      {!isDocumentsPage && !isLivePage && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-white/10 rounded-t-[30px]">
          <div className="w-full max-w-[1800px] mx-auto px-2">
            <div className="flex items-center justify-between py-2">
              {/* Projects button */}
              <Link href={projectItem.href} className="flex flex-col items-center justify-center px-2 py-1 text-white">
                <Building2 className="h-4 w-4 mb-0.5" />
                <span className="text-[10px]">Projects</span>
              </Link>

              {/* Filter button */}
              <button
                className="flex flex-col items-center justify-center px-2 py-1 text-white"
                onClick={() => setShowFilters(!showFilters)}
              >
                <svg className="h-4 w-4 mb-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M6 12h12M9 18h6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-[10px]">Filter</span>
              </button>

              {/* City button */}
              <Link
                href={isAlAinPage ? "/abu-dhabi" : "/al-ain"}
                className="flex flex-col items-center justify-center px-2 py-1 text-white"
              >
                <span className="text-[10px] font-medium">{isAlAinPage ? "Abu Dhabi" : "Al Ain"}</span>
                <span className="text-[8px]">City</span>
              </Link>

              {/* Manage button */}
              <Link href="/admin" className="flex flex-col items-center justify-center px-2 py-1 text-white">
                <svg className="h-4 w-4 mb-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path
                    d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-[10px]">Manage</span>
              </Link>

              {/* Log In button */}
              <Link href="/login" className="flex flex-col items-center justify-center px-2 py-1 text-white">
                <svg className="h-4 w-4 mb-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path
                    d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-[10px]">Log In</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default TopNav
