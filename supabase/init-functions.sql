-- Function to create projects table if it doesn't exist
CREATE OR REPLACE FUNCTION create_projects_table_if_not_exists()
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'projects') THEN
    CREATE TABLE public.projects (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      name TEXT NOT NULL,
      description TEXT,
      location TEXT,
      status TEXT,
      start_date DATE,
      end_date DATE,
      budget NUMERIC,
      manager TEXT,
      team TEXT[],
      metadata JSONB,
      user_id UUID,
      latitude DOUBLE PRECISION,
      longitude DOUBLE PRECISION
    );

    -- Add RLS policies
    ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
    
    -- Create policy for authenticated users
    CREATE POLICY "Allow authenticated users full access" 
      ON public.projects 
      USING (auth.role() = 'authenticated');
      
    -- Create policy for anonymous users to read
    CREATE POLICY "Allow anonymous users to read" 
      ON public.projects 
      FOR SELECT
      USING (true);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to create documents table if it doesn't exist
CREATE OR REPLACE FUNCTION create_documents_table_if_not_exists()
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'documents') THEN
    CREATE TABLE public.documents (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      title TEXT,
      description TEXT,
      filename TEXT NOT NULL,
      file_path TEXT NOT NULL,
      file_type TEXT,
      file_size BIGINT,
      project_id UUID,
      user_id UUID,
      metadata JSONB
    );

    -- Add RLS policies
    ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
    
    -- Create policy for authenticated users
    CREATE POLICY "Allow authenticated users full access" 
      ON public.documents 
      USING (auth.role() = 'authenticated');
      
    -- Create policy for anonymous users to read
    CREATE POLICY "Allow anonymous users to read" 
      ON public.documents 
      FOR SELECT
      USING (true);
  END IF;
END;
$$ LANGUAGE plpgsql;
