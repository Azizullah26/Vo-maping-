import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    // Get Supabase credentials from environment variables
    const supabaseUrl = process.env.SUPABASE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { success: false, message: "Missing Supabase credentials in environment variables" },
        { status: 500 },
      )
    }

    // Initialize Supabase client with service role key for admin privileges
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Create documents table if it doesn't exist
    const { error } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT,
        file_name TEXT,
        type TEXT,
        file_type TEXT,
        size BIGINT,
        file_size BIGINT,
        file_path TEXT,
        file_url TEXT,
        project_id TEXT NOT NULL,
        project_name TEXT,
        document_type TEXT,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `)

    if (error) {
      console.error("Error creating documents table:", error)
      return NextResponse.json(
        { success: false, message: `Error creating documents table: ${error.message}` },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Documents table initialized successfully!",
    })
  } catch (error) {
    console.error("Error initializing documents table:", error)
    return NextResponse.json(
      {
        success: false,
        message: `Error initializing documents table: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    )
  }
}
