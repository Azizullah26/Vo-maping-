import { NextResponse } from "next/server"
import { getDocumentsByProject } from "@/lib/document-service"

export async function GET(request: Request, { params }: { params: { projectId: string } }) {
  try {
    const projectId = params.projectId

    if (!projectId) {
      return NextResponse.json({ success: false, error: "Project ID is required" }, { status: 400 })
    }

    // Check if we're in a build environment and return empty data
    if (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.warn("Build environment detected without Supabase config, returning empty documents")
      return NextResponse.json({
        success: true,
        data: [],
      })
    }

    const documents = await getDocumentsByProject(projectId)

    return NextResponse.json({
      success: true,
      data: documents,
    })
  } catch (error) {
    console.error("Error fetching project documents:", error)

    // During build time, return empty data instead of failing
    if (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({
        success: true,
        data: [],
      })
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch project documents",
      },
      { status: 500 },
    )
  }
}
