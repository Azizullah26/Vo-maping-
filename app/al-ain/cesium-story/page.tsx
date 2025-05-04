"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { Card, CardContent } from "@/components/ui/card"

// Dynamically import the CesiumStoryViewer component with no SSR
const CesiumStoryViewer = dynamic(() => import("@/components/CesiumStoryViewer"), { ssr: false })

export default function CesiumStoryPage() {
  const [error, setError] = useState<Error | null>(null)
  const storyId = "8149f761-66f7-4da4-bef0-2535c22071ac"

  return (
    <div className="relative w-full h-screen bg-slate-900">
      <div className="absolute top-4 left-4 z-50">
        <Link href="/al-ain">
          <Button variant="secondary" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Al Ain
          </Button>
        </Link>
      </div>

      {error ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <Card className="w-full max-w-md mx-auto">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h2 className="text-xl font-semibold text-red-600">Error Loading Cesium Story</h2>
                <p className="text-gray-700">{error.message}</p>
                <p className="text-sm text-gray-500">
                  This could be due to the story not being publicly accessible or network issues.
                </p>
                <div className="flex justify-center gap-4 mt-4">
                  <Button onClick={() => window.location.reload()}>Try Again</Button>
                  <Link href="/al-ain">
                    <Button variant="outline">Return to Al Ain</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="w-full h-full">
          <CesiumStoryViewer onError={setError} storyId={storyId} />
        </div>
      )}
    </div>
  )
}
