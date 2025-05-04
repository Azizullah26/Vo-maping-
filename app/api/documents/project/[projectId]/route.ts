import { NextResponse } from "next/server"
import { getDocumentsByProject } from "@/lib/document-service"

export async function GET(request: Request, { params }: { params: { projectId: string } }) {
  try {
    const projectId = params.projectId

    const documents = await getDocumentsByProject(projectId)

    return NextResponse.json({
      success: true,
      data: documents,
    })
  } catch (error) {
    console.error("Error getting project documents:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
