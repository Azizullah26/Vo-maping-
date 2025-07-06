"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

// Dynamically import the Cesium component to avoid SSR issues
const CesiumStoryViewer = dynamic(() => import("@/components/CesiumStoryViewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mb-4"></div>
        <p className="text-white text-lg">Loading Cesium Story...</p>
      </div>
    </div>
  ),
})

export default function CesiumStoryPage() {
  const router = useRouter()

  return (
    <div className="relative w-full h-screen bg-gray-900">
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="text-white hover:bg-black/50 bg-black/30 backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Al Ain
        </Button>
      </div>

      {/* Cesium Story Viewer */}
      <Suspense
        fallback={
          <div className="w-full h-screen flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mb-4"></div>
              <p className="text-white text-lg">Loading Cesium Story...</p>
            </div>
          </div>
        }
      >
        <CesiumStoryViewer />
      </Suspense>
    </div>
  )
}
