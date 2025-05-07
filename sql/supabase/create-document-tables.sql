CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION create_documents_table_if_not_exists()
RETURNS VOID AS $$
BEGIN
  -- Check if the table already exists
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'documents') THEN
    -- Create the table if it doesn't exist
    CREATE TABLE documents (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      file_name VARCHAR(255) NOT NULL,
      file_type VARCHAR(100),
      file_size BIGINT,
      file_path TEXT,
      file_url TEXT NOT NULL,
      project_id VARCHAR(50),
      project_name VARCHAR(255),
      description TEXT DEFAULT '',
      document_type VARCHAR(50),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Call the function to create the table
SELECT create_documents_table_if_not_exists();
