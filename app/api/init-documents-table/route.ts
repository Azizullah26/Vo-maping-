import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase credentials for init-documents-table API")
    return null
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
    },
  })
}

export async function POST() {
  try {
    const supabaseAdmin = getSupabaseAdmin()

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, message: "Missing Supabase credentials" }, { status: 500 })
    }

    // Check if project_documents table exists
    const { data: projectDocumentsExists, error: projectDocumentsError } = await supabaseAdmin
      .from("project_documents")
      .select("id", { count: "exact", head: true })
      .limit(1)

    if (projectDocumentsError) {
      if (
        projectDocumentsError.message.includes("relation") &&
        projectDocumentsError.message.includes("does not exist")
      ) {
        console.log("project_documents table does not exist, will create it")
      } else {
        console.error("Error checking project_documents table:", projectDocumentsError)
      }
    } else {
      console.log("project_documents table exists")
      return NextResponse.json({
        success: true,
        message: "project_documents table already exists",
      })
    }

    const createTableSql = `
      CREATE TABLE IF NOT EXISTS project_documents (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        project_name TEXT NOT NULL,
        file_name TEXT NOT NULL,
        file_url TEXT NOT NULL,
        uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );
    `

    const { error } = await supabaseAdmin.rpc("execute_sql", { sql_query: createTableSql })

    if (error) {
      console.error("Error creating project_documents table:", error)
      return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "project_documents table ensured." })
  } catch (error) {
    console.error("Error in init-documents-table API:", error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
