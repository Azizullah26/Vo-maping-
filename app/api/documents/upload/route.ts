import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase" // Import the updated Database type

// Initialize Supabase client with service role key to bypass RLS
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials in environment variables for /api/documents/upload")
  console.error("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "present" : "missing")
  console.error("SUPABASE_SERVICE_ROLE_KEY:", supabaseServiceKey ? "present" : "missing")
}

// Only create client if both environment variables are present
const supabaseAdmin = supabaseUrl && supabaseServiceKey 
  ? createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
      },
    })
  : null

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase client is available
    if (!supabaseAdmin) {
      console.error("Supabase client not initialized - missing environment variables")
      return NextResponse.json(
        { 
          success: false, 
          error: "Server configuration error: Missing Supabase credentials. Please check environment variables." 
        },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const projectName = formData.get("projectName") as string // Use projectName directly

    if (!file || !projectName) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: file or projectName" },
        { status: 400 },
      )
    }

    // Generate unique filename and path within the project-documents bucket
    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, "-")}`
    const filePath = `projects/${projectName}/${fileName}` // Organize by project name

    // Convert File to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    // 1. Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from("project-documents") // Use the specified bucket name
      .upload(filePath, buffer, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      })

    if (uploadError) {
      console.error("Error uploading file to Supabase Storage:", uploadError)
      return NextResponse.json({ success: false, error: uploadError.message }, { status: 500 })
    }

    // 2. Get the public URL for the uploaded file
    const { data: urlData } = await supabaseAdmin.storage.from("project-documents").getPublicUrl(filePath)

    if (!urlData?.publicUrl) {
      return NextResponse.json(
        { success: false, error: "Failed to get public URL for the uploaded file" },
        { status: 500 },
      )
    }

    const fileUrl = urlData.publicUrl

    // 3. Save metadata to project_documents table in Supabase
    const { data: insertedData, error: documentError } = await supabaseAdmin
      .from("project_documents") // Use the new table name
      .insert({
        project_name: projectName,
        file_name: file.name,
        file_url: fileUrl,
        uploaded_at: new Date().toISOString(), // Set uploaded_at
      })
      .select()

    if (documentError) {
      // If metadata insertion fails, delete the uploaded file from storage
      await supabaseAdmin.storage.from("project-documents").remove([filePath])
      console.error("Error inserting document metadata:", documentError)
      return NextResponse.json({ success: false, error: documentError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      document: {
        id: insertedData?.[0]?.id || `temp-${Date.now()}`,
        file_url: fileUrl,
        file_name: file.name,
      },
    })
  } catch (error) {
    console.error("Error in document upload API:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
