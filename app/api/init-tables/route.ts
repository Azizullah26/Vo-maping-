import { NextResponse } from "next/server"
import { ensureProjectTable } from "@/app/actions/project-actions"
import { ensureDocumentTable } from "@/app/actions/document-actions"

export async function GET() {
  try {
    // Create project table
    const projectTableResult = await ensureProjectTable()

    if (!projectTableResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: projectTableResult.error || "Failed to create project table",
        },
        { status: 500 },
      )
    }

    // Create document table
    const documentTableResult = await ensureDocumentTable()

    if (!documentTableResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: documentTableResult.error || "Failed to create document table",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Database tables initialized successfully",
    })
  } catch (error) {
    console.error("Error initializing database tables:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error initializing database tables",
      },
      { status: 500 },
    )
  }
}
