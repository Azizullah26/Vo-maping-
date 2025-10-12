import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

// GET /api/documents/[id] - Get a specific document
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Get document metadata from Supabase
    const { data: document, error } = await supabase.from("documents").select("*").eq("id", id).single()

    if (error || !document) {
      return NextResponse.json({ success: false, error: "Document not found" }, { status: 404 })
    }

    // Get the signed URL for the document
    const { data: urlData, error: urlError } = await supabase.storage
      .from("project-documents")
      .createSignedUrl(`${document.project_id}/${document.file_path}`, 60 * 60) // 1 hour expiry

    if (urlError || !urlData) {
      return NextResponse.json({ success: false, error: "Failed to generate document URL" }, { status: 500 })
    }

    // Redirect to the signed URL
    return NextResponse.redirect(urlData.signedUrl)
  } catch (error) {
    console.error("Error fetching document:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch document" }, { status: 500 })
  }
}
