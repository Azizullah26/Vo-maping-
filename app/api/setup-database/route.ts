import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    // Get environment variables with fallbacks
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.REACT_APP_SUPABASE_URL ||
      "https://igxzfbxlfptgthfxtbae.supabase.co"

    const supabaseKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.REACT_APP_SUPABASE_ANON_KEY ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlneHpmYnhsZnB0Z3RoZnh0YmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNDAwNzcsImV4cCI6MjA1NjgxNjA3N30.OFjYjmuwJ2a_VHqoWdwFy6HxIk9phU0skCoaaBkIxhQ"

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Check if the documents table exists
    const { data, error } = await supabase.from("documents").select("id").limit(1)

    if (error && error.code === "42P01") {
      // Table doesn't exist, create it
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS documents (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          project_id TEXT NOT NULL,
          file_name TEXT NOT NULL,
          file_path TEXT NOT NULL,
          file_type TEXT NOT NULL,
          file_size INTEGER NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `

      const { error: createError } = await supabase.rpc("exec_sql", { query: createTableQuery })

      if (createError) {
        return NextResponse.json(
          {
            success: false,
            message: "Failed to create documents table",
            error: createError,
          },
          { status: 500 },
        )
      }

      return NextResponse.json({
        success: true,
        message: "Documents table created successfully",
      })
    }

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Error checking documents table",
          error,
        },
        { status: 500 },
      )
    }

    // Table exists
    return NextResponse.json({
      success: true,
      message: "Documents table already exists",
    })
  } catch (error) {
    console.error("Setup database error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error,
      },
      { status: 500 },
    )
  }
}
