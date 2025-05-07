import { NextResponse } from "next/server"
import { getAllDocuments } from "@/lib/document-service"

export async function GET() {
  try {
    const documents = await getAllDocuments()

    return NextResponse.json({
      success: true,
      data: documents,
    })
  } catch (error) {
    console.error("Error fetching documents:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch documents",
      },
      { status: 500 },
    )
  }
}
