import { type NextRequest, NextResponse } from "next/server"
import { getProjectDocuments } from "@/lib/db"

// GET handler to get documents for a specific project
export async function GET(request: NextRequest, { params }: { params: { projectId: string } }) {
  try {
    const projectId = params.projectId

    if (!projectId) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing project ID",
        },
        { status: 400 },
      )
    }

    const result = await getProjectDocuments(projectId)

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message || "Failed to get project documents",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    })
  } catch (error) {
    console.error("Error getting project documents:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
