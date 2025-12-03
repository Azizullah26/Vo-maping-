import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const dynamic = "force-dynamic"

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    return null
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const supabase = getSupabaseAdmin()

    if (!supabase) {
      return NextResponse.json({ success: false, error: "Supabase not configured" }, { status: 500 })
    }

    // First get the document to find the file path
    const { data: document, error: fetchError } = await supabase.from("documents").select("*").eq("id", id).single()

    if (fetchError || !document) {
      console.error("Error fetching document:", fetchError)
      return NextResponse.json(
        {
          success: false,
          error: fetchError?.message || "Document not found",
        },
        { status: fetchError ? 500 : 404 },
      )
    }

    // Delete the document from the database
    const { error: deleteError } = await supabase.from("documents").delete().eq("id", id)

    if (deleteError) {
      console.error("Error deleting document:", deleteError)
      return NextResponse.json(
        {
          success: false,
          error: deleteError.message,
        },
        { status: 500 },
      )
    }

    // If the document has a file in storage, delete it too
    if (document.file_path) {
      try {
        const { error: storageError } = await supabase.storage.from("documents").remove([document.file_path])

        if (storageError) {
          console.warn("Could not delete file from storage:", storageError)
        }
      } catch (storageErr) {
        console.warn("Error when trying to delete file from storage:", storageErr)
      }
    }

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error("Error deleting document:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
