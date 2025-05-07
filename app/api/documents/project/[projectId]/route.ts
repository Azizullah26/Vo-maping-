import { NextResponse } from "next/server"
import { getDocumentsByProject } from "@/lib/document-service"

export async function GET(request: Request, { params }: { params: { projectId: string } }) {
  try {
    const projectId = params.projectId

    if (!projectId) {
      return NextResponse.json({ success: false, error: "Project ID is required" }, { status: 400 })
    }

    const documents = await getDocumentsByProject(projectId)

    return NextResponse.json({
      success: true,
      data: documents,
    })
  } catch (error) {
    console.error("Error fetching project documents:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch project documents",
      },
      { status: 500 },
    )
  }
}
