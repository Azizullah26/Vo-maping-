import { type NextRequest, NextResponse } from "next/server"
import { getDocumentsByProject } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { projectId: string } }) {
  try {
    // Check if we're in build environment
    if (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({
        documents: [],
        message: "Database not configured",
      })
    }

    const { projectId } = params

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    const documents = await getDocumentsByProject(projectId)

    return NextResponse.json({
      documents,
      count: documents.length,
    })
  } catch (error) {
    console.error("Error fetching project documents:", error)

    // Return empty array instead of error during build
    if (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({
        documents: [],
        message: "Database not configured",
      })
    }

    return NextResponse.json(
      {
        error: "Failed to fetch documents",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest, { params }: { params: { projectId: string } }) {
  try {
    // Check if we're in build environment
    if (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json(
        {
          error: "Database not configured",
        },
        { status: 503 },
      )
    }

    const { projectId } = params
    const body = await request.json()

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    // Here you would typically add document creation logic
    // For now, return a placeholder response
    return NextResponse.json({
      message: "Document creation endpoint",
      projectId,
      body,
    })
  } catch (error) {
    console.error("Error creating project document:", error)
    return NextResponse.json(
      {
        error: "Failed to create document",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
