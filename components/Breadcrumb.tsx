"use client"
import type React from "react"
import Link from "next/link"

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
      className="px-2 py-2 rounded-l-full flex items-center justify-between w-fit mt-6 sm:mt-8 md:mt-10"
    >
      <div className="flex items-center space-x-2">
        <Link
          href="/"
          className="flex-shrink-0 bg-white rounded-full p-1 flex items-center justify-center"
          style={{ width: "32px", height: "32px" }}
        >
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/our%20main%20logo%202025-01-Qfxvimv60zcUduv8DZzSRzoS6qKX09.png"
            alt="El Race Contracting Logo"
            className="h-5 w-auto"
          />
        </Link>

        <ol className="flex items-center space-x-1">
          <li className="flex items-center">
            <Link href="/" className="text-gray-300 hover:text-black hover:bg-white p-1 rounded transition-all">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-arrow-up"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"
                />
              </svg>
            </Link>
          </li>
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              <span className="text-gray-400 mx-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  fill="currentColor"
                  className="bi bi-chevron-right"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                  />
                </svg>
              </span>
              {index === items.length - 1 ? (
                <span className="text-black bg-white px-2 py-1 rounded-full text-sm">{item.label}</span>
              ) : (
                <Link
                  href={item.path}
                  className="text-gray-300 hover:text-black hover:bg-white px-2 py-1 rounded transition-all text-sm"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>

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
        className="text-gray-300 hover:text-black hover:bg-white p-1 bg-amber-900 ml-2 transition-all rounded-full"
        aria-label="Go back"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
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
