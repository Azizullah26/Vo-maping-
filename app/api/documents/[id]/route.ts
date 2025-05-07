import { NextResponse } from "next/server"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Use Supabase client instead of direct pg connection
    const supabase = createServerComponentClient<Database>({ cookies })

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
          // Continue anyway as the database record is deleted
        }
      } catch (storageErr) {
        console.warn("Error when trying to delete file from storage:", storageErr)
        // Continue anyway as the database record is deleted
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
