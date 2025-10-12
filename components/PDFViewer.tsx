"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Download } from "lucide-react"

interface PDFViewerProps {
  fileUrl: string
}

export function PDFViewer({ fileUrl }: PDFViewerProps) {
  const [pageNumber, setPageNumber] = useState(1)
  const [error, setError] = useState<string | null>(null)

  // Simple web-based PDF viewer
  return (
    <Card className="w-full max-w-3xl mx-auto bg-white/10 backdrop-filter backdrop-blur-md">
      <CardContent className="p-4">
        {error ? (
          <div className="text-red-500">
            <p>{error}</p>
            <p>File URL: {fileUrl}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <iframe
              src={`${fileUrl}#page=${pageNumber}`}
              className="w-full h-[600px] border-0 rounded-lg"
              title="PDF Viewer"
            />
            <div className="flex justify-between items-center w-full">
              <Button onClick={() => setPageNumber((page) => Math.max(page - 1, 1))}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <p>Page {pageNumber}</p>
              <Button onClick={() => setPageNumber((page) => page + 1)}>
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <Button onClick={() => window.open(fileUrl, "_blank")}>
              <Download className="mr-2 h-4 w-4" /> Download PDF
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
