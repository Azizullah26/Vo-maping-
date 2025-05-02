-- Create a stored procedure to create the documents table if it doesn't exist
CREATE OR REPLACE FUNCTION create_documents_table_if_not_exists()
RETURNS void AS $$
BEGIN
  -- Check if the documents table exists
  IF NOT EXISTS (
    SELECT FROM pg_tables
    WHERE schemaname = 'public' AND tablename = 'documents'
  ) THEN
    -- Create the documents table
    CREATE TABLE documents (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      file_name VARCHAR(255) NOT NULL,
      file_type VARCHAR(100),
      size BIGINT,
      file_path TEXT,
      file_url TEXT NOT NULL,
      project_id VARCHAR(50),
      project_name VARCHAR(255),
      description TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Enable Row Level Security
    ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
    
    -- Create a policy that allows all operations for authenticated users
    CREATE POLICY "Allow all operations for authenticated users" 
    ON documents FOR ALL 
    USING (auth.role() = 'authenticated');
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create a stored procedure to create the projects table if it doesn't exist
CREATE OR REPLACE FUNCTION create_projects_table_if_not_exists()
RETURNS void AS $$
BEGIN
  -- Check if the projects table exists
  IF NOT EXISTS (
    SELECT FROM pg_tables
    WHERE schemaname = 'public' AND tablename = 'projects'
  ) THEN
    -- Create the projects table
    CREATE TABLE projects (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(255) NOT NULL,
      description TEXT,
      location VARCHAR(255),
      latitude FLOAT,
      longitude FLOAT,
      start_date TIMESTAMP WITH TIME ZONE,
      end_date TIMESTAMP WITH TIME ZONE,
      status VARCHAR(50) DEFAULT 'Active',
      progress INTEGER DEFAULT 0,
      budget DECIMAL(15, 2),
      manager_name VARCHAR(255),
      manager_id VARCHAR(50),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Enable Row Level Security
    ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
    
    -- Create a policy that allows all operations for authenticated users
    CREATE POLICY "Allow all operations for authenticated users" 
    ON projects FOR ALL 
    USING (auth.role() = 'authenticated');
  END IF;
END;
$$ LANGUAGE plpgsql;
