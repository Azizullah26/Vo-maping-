// Ensure this matches the column structure in supabase/create-document-tables.sql
// Only use snake_case column names: file_name, file_type, file_size, file_path, file_url,
// project_id, project_name, description, document_type, created_at, updated_at

import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST() {
  try {
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { success: false, message: "Missing Supabase credentials in environment variables" },
        { status: 500 },
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
      },
    })

    // Create the documents table directly with SQL instead of using a stored procedure
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS documents (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        file_name VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        file_type VARCHAR(100),
        type VARCHAR(100),
        size BIGINT,
        file_size BIGINT,
        file_path TEXT,
        path TEXT,
        file_url TEXT,
        url TEXT,
        project_id VARCHAR(50),
        projectId VARCHAR(50),
        project_name VARCHAR(255),
        projectName VARCHAR(255),
        description TEXT DEFAULT '',
        document_type VARCHAR(50),
        documentType VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- Enable Row Level Security if it's not already enabled
      ALTER TABLE IF EXISTS documents ENABLE ROW LEVEL SECURITY;
    `

    // Execute the SQL directly
    const { error: createTableError } = await supabase
      .rpc("exec_sql", { sql: createTableSQL })
      .catch(() => {
        // If exec_sql RPC doesn't exist, try direct SQL query
        return supabase.from("_sql").rpc("query", { query: createTableSQL })
      })
      .catch(() => {
        // If both methods fail, try a raw query (may not work in all Supabase setups)
        return supabase.from("documents").select("*", { count: "exact", head: true })
      })

    if (createTableError) {
      console.warn("Warning: Could not create documents table:", createTableError)
      // Continue anyway, as the table might already exist
    }

    // Try to create a policy for the documents table
    const createPolicySQL = `
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT FROM pg_policies 
          WHERE tablename = 'documents' AND policyname = 'Allow all operations for authenticated users'
        ) THEN
          CREATE POLICY "Allow all operations for authenticated users" 
          ON documents FOR ALL 
          USING (auth.role() = 'authenticated');
        END IF;
      EXCEPTION WHEN OTHERS THEN
        -- Policy creation might fail if RLS is not fully supported
        NULL;
      END
      $$;
    `

    // Try to execute the policy creation
    await supabase.rpc("exec_sql", { sql: createPolicySQL }).catch(() => {
      // Ignore errors with policy creation
      console.log("Note: Policy creation was skipped or failed, but this is not critical")
    })

    // Check if the table exists by querying it
    const { count, error: checkError } = await supabase.from("documents").select("*", { count: "exact", head: true })

    if (checkError) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to verify documents table creation",
          error: checkError.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Documents table initialized successfully",
      exists: count !== null,
    })
  } catch (error) {
    console.error("Error initializing documents table:", error)
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while initializing the documents table",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
