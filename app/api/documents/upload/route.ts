import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client with service role key to bypass RLS
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials in environment variables")
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
  },
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const projectId = formData.get("projectId") as string
    const projectName = formData.get("projectName") as string

    if (!file || !projectId || !projectName) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Generate unique filename and path
    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, "-")}`
    const filePath = `projects/${projectId}/${fileName}`

    // Convert File to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    // 1. Upload file to Supabase Storage
    // Make sure we're using the correct bucket name "project-documents" consistently

    // Update the upload function to explicitly use "project-documents" bucket
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from("project-documents")
      .upload(filePath, buffer, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      })

    if (uploadError) {
      console.error("Error uploading file:", uploadError)
      return NextResponse.json({ success: false, error: uploadError.message }, { status: 500 })
    }

    // 2. Get the public URL for the uploaded file
    // Update the URL retrieval to use the same bucket name
    const { data: urlData } = await supabaseAdmin.storage.from("project-documents").getPublicUrl(filePath)

    if (!urlData?.publicUrl) {
      return NextResponse.json(
        { success: false, error: "Failed to get public URL for the uploaded file" },
        { status: 500 },
      )
    }

    const fileUrl = urlData.publicUrl
    const fileType = file.type
    const fileExtension = file.name.split(".").pop()?.toUpperCase() || "FILE"

    // 3. Save metadata to documents table in Supabase
    // First, check the table structure to see what columns exist
    const { data: tableInfo, error: tableError } = await supabaseAdmin.from("documents").select("*").limit(1)

    if (tableError) {
      console.error("Error checking table structure:", tableError)
      // Continue with best effort approach
    }

    // Create a document object with all possible field variations to handle different schema versions
    // Add the "name" field to fix the not-null constraint violation
    const documentData = {
      name: file.name, // Add this line to fix the not-null constraint
      file_name: file.name,
      file_type: fileType,
      file_size: file.size,
      file_path: filePath,
      project_id: projectId,
      project_name: projectName,
      document_type: fileExtension,
      file_url: fileUrl,
      description: "", // Empty description
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data: insertedData, error: documentError } = await supabaseAdmin
      .from("documents")
      .insert(documentData)
      .select()

    if (documentError) {
      // If metadata insertion fails, delete the uploaded file
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
