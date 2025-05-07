import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Use environment variables for Supabase connection
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Create Supabase client (this is serverless-compatible)
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Delete from the documents table
    const { error: dbError } = await supabase.from("documents").delete().eq("id", id)

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`)
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage.from("documents").remove([`${id}`])

    if (storageError) {
      console.warn(`Storage error: ${storageError.message}`)
      // Continue even if storage deletion fails
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
