import { type NextRequest, NextResponse } from "next/server"
import { updateProject, deleteProject } from "@/lib/admin-db"

// PUT handler to update a project
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const updates = await request.json()

    const result = await updateProject(id, updates)

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error in PUT /api/projects/${params.id}:`, error)
    return NextResponse.json({ success: false, error: "Failed to update project" }, { status: 500 })
  }
}

// DELETE handler to delete a project
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const result = await deleteProject(id)

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error in DELETE /api/projects/${params.id}:`, error)
    return NextResponse.json({ success: false, error: "Failed to delete project" }, { status: 500 })
  }
}
