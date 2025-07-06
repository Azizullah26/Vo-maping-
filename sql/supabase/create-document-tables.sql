-- Create the project_documents table
CREATE TABLE IF NOT EXISTS project_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_name TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Optional: Add RLS policies if not already handled globally
-- For simplicity, we'll assume RLS is managed elsewhere or for authenticated users.
-- If you need RLS for this table, you would add:
-- ALTER TABLE project_documents ENABLE ROW LEVEL SECURITY;
-- DROP POLICY IF EXISTS "Enable read access for all users" ON project_documents;
-- CREATE POLICY "Enable read access for all users" ON project_documents FOR SELECT USING (TRUE);
-- DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON project_documents;
-- CREATE POLICY "Enable insert for authenticated users only" ON project_documents FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON project_documents;
-- CREATE POLICY "Enable delete for authenticated users only" ON project_documents FOR DELETE USING (auth.role() = 'authenticated');
