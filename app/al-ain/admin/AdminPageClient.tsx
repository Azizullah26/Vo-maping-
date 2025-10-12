"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { ErrorBoundary, AdminFallback } from "@/components/ErrorBoundary"
import { TopNav } from "@/components/TopNav"
import { DocumentPreview } from "@/components/DocumentPreview"

// Document type definition for TypeScript
interface Document {
  id: string
  name: string
  type: string
  size: string
  date: string
  url: string
  project: string
}

export default function AdminPageClient() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null)

  useEffect(() => {
    // Add console logs to help debug
    console.log("AdminPageClient mounted")

    // Simulate loading
    const timer = setTimeout(() => {
      console.log("Loading complete")
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Log when rendering
  console.log("AdminPageClient rendering, loading:", loading, "error:", error)

  return (
    <ErrorBoundary fallback={<AdminFallback />}>
      <div className="min-h-screen bg-gradient-to-br from-[#1b1464]/10 via-[#2a2a72]/10 to-[#000000]/10">
        <TopNav />

        <div className="container mx-auto px-4 py-8 mt-16">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Admin Dashboard</CardTitle>
              <CardDescription>Simplified version for debugging</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B1464]"></div>
                </div>
              ) : error ? (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : (
                <div>
                  <p className="mb-4">Admin dashboard content loaded successfully!</p>
                  <Link href="/al-ain">
                    <Button>Back to Al Ain</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        {previewDocument && (
          <DocumentPreview
            isOpen={!!previewDocument}
            onClose={() => setPreviewDocument(null)}
            document={previewDocument}
          />
        )}
      </div>
    </ErrorBoundary>
  )
}
