import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ success: false, error: "Missing Supabase environment variables" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Fetch document by ID
    const { data, error } = await supabase.from("documents").select("*").eq("id", id).single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ success: false, error: "Document not found" }, { status: 404 })
      }
      throw error
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error fetching document:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch document",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ success: false, error: "Missing Supabase environment variables" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // First get the document to get the file path
    const { data: document, error: fetchError } = await supabase.from("documents").select("*").eq("id", id).single()

    if (fetchError) {
      if (fetchError.code === "PGRST116") {
        return NextResponse.json({ success: false, error: "Document not found" }, { status: 404 })
      }
      throw fetchError
    }

    // Delete the document from the database
    const { error: deleteError } = await supabase.from("documents").delete().eq("id", id)

    if (deleteError) {
      throw deleteError
    }

    // Delete the file from storage if we have a file path
    if (document.file_path) {
      const { error: storageError } = await supabase.storage.from("project-documents").remove([document.file_path])

      if (storageError) {
        console.error("Error deleting file from storage:", storageError)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting document:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete document",
      },
      { status: 500 },
    )
  }
}
