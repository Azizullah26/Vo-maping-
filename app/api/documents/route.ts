import { NextResponse } from "next/server"
import { getAllDocuments, addDocument } from "@/lib/document-service"

export async function GET() {
  try {
    const documents = await getAllDocuments()

    return NextResponse.json({
      success: true,
      data: documents,
    })
  } catch (error) {
    console.error("Error getting documents:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, url, projectId } = body

    if (!title || !url) {
      return NextResponse.json(
        {
          success: false,
          error: "Title and URL are required",
        },
        { status: 400 },
      )
    }

    const result = await addDocument({
      title,
      description: description || "",
      url,
      projectId,
    })

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    })
  } catch (error) {
    console.error("Error adding document:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
