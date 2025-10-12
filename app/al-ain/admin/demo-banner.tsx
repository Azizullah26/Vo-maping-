import type React from "react"

interface DemoBannerProps {
  message?: string
}

const DemoBanner: React.FC<DemoBannerProps> = ({
  message = "You're currently in demo mode. Database connection is not configured.",
}) => {
  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded">
      <div className="flex items-center">
        <div className="py-1">
          <svg
            className="h-6 w-6 text-yellow-500 mr-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div>
          <p className="font-bold">Demo Mode</p>
          <p className="text-sm">{message}</p>
        </div>
      </div>
    </div>
  )
}

export default DemoBanner
