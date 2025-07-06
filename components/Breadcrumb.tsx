"use client"
import type React from "react"

interface BreadcrumbItem {
  label: string
  path: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  currentPath?: string
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items = [], currentPath = "" }) => {
  return (
    <nav
      aria-label="Breadcrumb navigation"
      className="px-2 py-2 rounded-full flex items-center justify-center w-fit mt-6 sm:mt-8 md:mt-10"
    >
      <button
        onClick={(e) => {
          e.preventDefault()
          // Close any open sliders by dispatching a custom event
          const closeSliderEvent = new CustomEvent("closeSliders")
          window.dispatchEvent(closeSliderEvent)
          // Add a small delay before navigating back
          setTimeout(() => {
            window.history.back()
          }, 50)
        }}
        className="text-gray-300 hover:text-black hover:bg-white p-2 bg-amber-900 transition-all rounded-full"
        aria-label="Go back"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className="bi bi-arrow-left"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
          />
        </svg>
      </button>
    </nav>
  )
}

// Default export for backward compatibility
export default Breadcrumb
