import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Initialize Supabase client with service role key for server-side fetching
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials for /api/documents")
}

const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
  },
})

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("project_documents") // Fetch from the new table
      .select("*")
      .order("uploaded_at", { ascending: false }) // Order by uploaded_at

    if (error) {
      console.error("Error fetching documents from project_documents:", error)
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 },
      )
    }

    // Map the data to a consistent format if needed, or return directly
    const documents = data.map((doc) => ({
      id: doc.id,
      project_name: doc.project_name,
      file_name: doc.file_name,
      file_url: doc.file_url,
      uploaded_at: doc.uploaded_at,
    }))

    return NextResponse.json({
      success: true,
      data: documents,
    })
  } catch (error) {
    console.error("Error fetching documents in API:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch documents",
      },
      { status: 500 },
    )
  }
}
