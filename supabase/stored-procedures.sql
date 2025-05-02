-- Create a function to execute arbitrary SQL
CREATE OR REPLACE FUNCTION execute_sql(query_text TEXT, query_params JSONB DEFAULT '[]')
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  EXECUTE query_text
  INTO result
  USING query_params;
  
  RETURN result;
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('error', SQLERRM);
END;
$$;

-- Create a function to get the database version
CREATE OR REPLACE FUNCTION get_db_version()
RETURNS TEXT
LANGUAGE sql
SECURITY INVOKER
AS $$
  SELECT version();
$$;

-- Create a function to get the current time
CREATE OR REPLACE FUNCTION get_current_time()
RETURNS TIMESTAMP WITH TIME ZONE
LANGUAGE sql
SECURITY INVOKER
AS $$
  SELECT NOW();
$$;

-- Create a function to create the documents table if it doesn't exist
CREATE OR REPLACE FUNCTION create_documents_table_if_not_exists()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename = 'documents'
  ) THEN
    CREATE TABLE public.documents (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      file_url TEXT NOT NULL,
      file_type VARCHAR(50),
      file_size BIGINT,
      project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    
    -- Add RLS policies
    ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
    
    -- Create policy for authenticated users
    CREATE POLICY "Allow authenticated users full access" ON public.documents
      USING (true)
      WITH CHECK (true);
  END IF;
END;
$$;

-- Create a function to create the projects table if it doesn't exist
CREATE OR REPLACE FUNCTION create_projects_table_if_not_exists()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename = 'projects'
  ) THEN
    CREATE TABLE public.projects (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      location VARCHAR(255),
      longitude DOUBLE PRECISION,
      latitude DOUBLE PRECISION,
      status VARCHAR(100) DEFAULT 'active',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    
    -- Add RLS policies
    ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
    
    -- Create policy for authenticated users
    CREATE POLICY "Allow authenticated users full access" ON public.projects
      USING (true)
      WITH CHECK (true);
  END IF;
END;
$$;
