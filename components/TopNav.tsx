"use client"

import type React from "react"
import Link from "next/link"
import { MapPin, Building2, Home, Warehouse, User, LayoutDashboard, Building } from "lucide-react"
import styles from "@/styles/nav-button.module.css"
import glowStyles from "@/styles/glow-button.module.css"
import { cn } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useAuth } from "@/app/contexts/AuthContext"
import { PageSwipingPanel } from "@/components/PageSwipingPanel"

// Add this import for the scrollbar-hide utility
import "tailwind-scrollbar-hide"

// Add these styles for better mobile touch targets
const mobileStyles = `
  @media (max-width: 640px) {
    .touch-target {
      min-height: 44px;
      min-width: 44px;
    }
    
    .active-nav-item::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 50%;
      transform: translateX(-50%);
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background-color: #06b6d4;
    }
  }
`

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
  const isAbuDhabiPage = pathname === "/abu-dhabi" || pathname.startsWith("/abu-dhabi/")
  const isDocumentsPage = pathname === "/al-ain/documents" || (pathname && pathname.startsWith("/al-ain/documents/"))
  const isLivePage = pathname === "/al-ain/live"
  const [showFilters, setShowFilters] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<Record<string, boolean>>({})
  const [isAuthReady, setIsAuthReady] = useState(false)
  const [isPageSwipingOpen, setIsPageSwipingOpen] = useState(false)
  const auth = useAuth()
  const router = useRouter()
  const isProjectsPage = pathname === "/projects-details" || pathname === "/abu-dhabi/projects"

  // Wait for auth to be ready before accessing its properties
  useEffect(() => {
    // Add mobile styles to head
    const styleElement = document.createElement("style")
    styleElement.textContent = mobileStyles
    document.head.appendChild(styleElement)

    return () => {
      document.head.removeChild(styleElement)
    }
  }, [])

  const handleFilterChange = (categoryName: string, filterId: string) => {
    setSelectedFilters((current) => ({
      ...current,
      [filterId]: !current[filterId],
    }))
  }

  return (
    <>
      {/* Simplified top section with just logo, text and map button - hide on documents page */}
      {!isDocumentsPage && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-white/10 rounded-b-[20px] xxs:rounded-b-[25px] sm:rounded-b-[30px]">
          <div className="w-full max-w-[1800px] mx-auto px-1 xxs:px-2">
            {/* The inner div with flex items-center justify-between has been removed */}
          </div>
        </div>
      )}

      {/* Filter buttons row - only show when showFilters is true */}
      {isAlAinPage && showFilters && (
        <div
          className={cn(
            "fixed top-[1.5rem] xxs:top-[1.6rem] xs:top-[1.75rem] sm:top-[2rem] md:top-[2.25rem] left-0 right-0 z-40",
            "transform transition-all duration-200 ease-in-out",
          )}
        >
          <div className="w-full max-w-[1800px] mx-auto px-1 sm:px-2 md:px-3 lg:px-4 py-1 sm:py-2">
            {/* Mobile view - scrollable horizontal container */}
            <div className="flex items-center overflow-x-auto scrollbar-hide pb-1 justify-start sm:justify-center">
              <div className="flex items-center gap-1 xxs:gap-1.5 xs:gap-1.5 sm:gap-2 md:gap-3 px-1">
                {filterButtons.map((button) => {
                  const Icon = button.icon
                  return (
                    <Button
                      key={button.id}
                      variant="ghost"
                      className={cn(
                        glowStyles.glowOnHover,
                        "text-white whitespace-nowrap",
                        "border border-white/20 rounded-md min-w-[50px] xxs:min-w-[55px] xs:min-w-[60px] px-1 xxs:px-1.5 xs:px-2 sm:px-4 md:px-6 py-0.5 xs:py-1 sm:py-1.5",
                        "transition-colors duration-200",
                        "flex items-center gap-0.5 xxs:gap-1 sm:gap-2",
                        "text-[7px] xxs:text-[8px] xs:text-[10px] sm:text-xs",
                        selectedFilters[button.id] ? "bg-white text-black hover:text-black" : "",
                      )}
                      onClick={() => handleFilterChange("category", button.id)}
                    >
                      <Icon
                        className={cn(
                          "h-2 w-2 xxs:h-2.5 xxs:w-2.5 xs:h-3 xs:w-3 sm:h-4 sm:w-4",
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
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-white/10 rounded-t-[20px] xxs:rounded-t-[25px] sm:rounded-t-[30px]">
          <div className="w-full max-w-[1800px] mx-auto px-1 xxs:px-2">
            <div className="flex items-center justify-between py-2 xxs:py-2.5 xs:py-3 sm:py-2">
              {/* Dashboard button */}
              <Link
                href="/dashboard"
                className="flex flex-col items-center justify-center px-1 xxs:px-1.5 xs:px-2 py-0.5 xxs:py-1 text-white"
              >
                <LayoutDashboard className="h-3 w-3 xxs:h-3.5 xxs:w-3.5 xs:h-4 xs:w-4 mb-0.5" />
                <span className="text-[8px] xxs:text-[9px] xs:text-[10px]">Dashboard</span>
              </Link>

              {/* Projects Details button */}
              <Link
                href={pathname.startsWith("/abu-dhabi") ? "/abu-dhabi/projects" : "/projects-details"}
                className={`flex flex-col items-center justify-center px-1 xxs:px-1.5 xs:px-2 py-0.5 xxs:py-1 text-white relative group touch-target ${isProjectsPage ? "active-nav-item" : ""}`}
              >
                <Building2 className="h-3 w-3 xxs:h-3.5 xxs:w-3.5 xs:h-4 xs:w-4 sm:h-5 sm:w-5 mb-0.5" />
                <span className="text-[8px] xxs:text-[9px] xs:text-[10px] sm:text-xs whitespace-nowrap">Projects</span>
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
              </Link>

              {/* Cities button */}
              <button
                onClick={() => setIsPageSwipingOpen(true)}
                className="flex flex-col items-center justify-center px-1 xxs:px-1.5 xs:px-2 py-0.5 xxs:py-1 text-white"
              >
                <Building className="h-3 w-3 xxs:h-3.5 xxs:w-3.5 xs:h-4 xs:w-4 mb-0.5" />
                <span className="text-[8px] xxs:text-[9px] xs:text-[10px]">Cities</span>
              </button>

              {/* Manage button */}
              <Link
                href="/manage"
                className="flex flex-col items-center justify-center px-1 xxs:px-1.5 xs:px-2 py-0.5 xxs:py-1 text-white"
              >
                <svg
                  className="h-3 w-3 xxs:h-3.5 xxs:w-3.5 xs:h-4 xs:w-4 mb-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path
                    d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 1.82-.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-[8px] xxs:text-[9px] xs:text-[10px]">Manage</span>
              </Link>

              {/* User profile button - only show on non-Abu Dhabi pages */}
              {!isAbuDhabiPage && (
                <div className="flex flex-col items-center justify-center px-1 xxs:px-1.5 xs:px-2 py-0.5 xxs:py-1 text-white">
                  <User className="h-3 w-3 xxs:h-3.5 xxs:w-3.5 xs:h-4 xs:w-4 mb-0.5" />
                  <span className="text-[8px] xxs:text-[9px] xs:text-[10px]">Profile</span>
                </div>
              )}

              {/* Admin button */}
              {showAdmin && (
                <button
                  className="flex flex-col items-center justify-center px-1 xxs:px-1.5 xs:px-2 py-0.5 xxs:py-1 text-white"
                  onClick={onAdminClick}
                >
                  <svg
                    className="h-3 w-3 xxs:h-3.5 xxs:w-3.5 xs:h-4 xs:w-4 mb-0.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2L2 22h20L12 2z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-[8px] xxs:text-[9px] xs:text-[10px]">Admin</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Page Swiping Panel */}
      <PageSwipingPanel isOpen={isPageSwipingOpen} onClose={() => setIsPageSwipingOpen(false)} />
    </>
  )
}

export default TopNav
