import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

function getAdminClient() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://cfeggyysgopkzygaitzw.supabase.co"
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    ""
  return createClient(url, key, { auth: { persistSession: false } })
}

const SETUP_SQL = `
-- Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Helper trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ── projects ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  name_ar     TEXT,
  description TEXT,
  status      TEXT NOT NULL DEFAULT 'planned',
  location    TEXT,
  latitude    DOUBLE PRECISION,
  longitude   DOUBLE PRECISION,
  image_url   TEXT,
  start_date  TIMESTAMPTZ,
  end_date    TIMESTAMPTZ,
  budget      TEXT,
  progress    INTEGER DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  manager     TEXT,
  manager_id  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS projects_updated_at ON projects;
CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='projects' AND policyname='Public read projects') THEN
    CREATE POLICY "Public read projects"   ON projects FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='projects' AND policyname='Public insert projects') THEN
    CREATE POLICY "Public insert projects" ON projects FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='projects' AND policyname='Public update projects') THEN
    CREATE POLICY "Public update projects" ON projects FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='projects' AND policyname='Public delete projects') THEN
    CREATE POLICY "Public delete projects" ON projects FOR DELETE USING (true);
  END IF;
END $$;

-- ── documents ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS documents (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         TEXT NOT NULL,
  file_name    TEXT,
  file_url     TEXT,
  file_type    TEXT,
  size         BIGINT DEFAULT 0,
  project_name TEXT,
  description  TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS documents_updated_at ON documents;
CREATE TRIGGER documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='documents' AND policyname='Public read documents') THEN
    CREATE POLICY "Public read documents"   ON documents FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='documents' AND policyname='Public insert documents') THEN
    CREATE POLICY "Public insert documents" ON documents FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='documents' AND policyname='Public update documents') THEN
    CREATE POLICY "Public update documents" ON documents FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='documents' AND policyname='Public delete documents') THEN
    CREATE POLICY "Public delete documents" ON documents FOR DELETE USING (true);
  END IF;
END $$;

-- ── project_documents ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS project_documents (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id   UUID REFERENCES projects(id) ON DELETE CASCADE,
  project_name TEXT,
  file_name    TEXT NOT NULL,
  file_url     TEXT,
  file_type    TEXT,
  size         BIGINT DEFAULT 0,
  description  TEXT,
  uploaded_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE project_documents ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='project_documents' AND policyname='Public read project_documents') THEN
    CREATE POLICY "Public read project_documents"   ON project_documents FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='project_documents' AND policyname='Public insert project_documents') THEN
    CREATE POLICY "Public insert project_documents" ON project_documents FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='project_documents' AND policyname='Public update project_documents') THEN
    CREATE POLICY "Public update project_documents" ON project_documents FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='project_documents' AND policyname='Public delete project_documents') THEN
    CREATE POLICY "Public delete project_documents" ON project_documents FOR DELETE USING (true);
  END IF;
END $$;
`

export async function GET() {
  try {
    const supabase = getAdminClient()

    // Use rpc to run raw SQL — requires a helper function in Supabase
    // We'll use the REST API directly via fetch instead
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cfeggyysgopkzygaitzw.supabase.co"
    const serviceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      ""

    const response = await fetch(`${url}/rest/v1/rpc/exec_sql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({ query: SETUP_SQL }),
    })

    // If exec_sql RPC doesn't exist, fall back to individual table checks + inserts
    if (!response.ok) {
      // Verify tables exist by querying them
      const results: Record<string, string> = {}

      for (const table of ["projects", "documents", "project_documents"]) {
        const { error } = await supabase.from(table).select("id").limit(1)
        results[table] = error
          ? `missing or error: ${error.message}`
          : "exists"
      }

      const allExist = Object.values(results).every((v) => v === "exists")

      if (allExist) {
        return NextResponse.json({
          success: true,
          message: "All tables already exist and are accessible.",
          tables: results,
        })
      }

      return NextResponse.json(
        {
          success: false,
          message:
            "Some tables are missing. Please run the SQL below manually in your Supabase SQL Editor (https://supabase.com/dashboard/project/cfeggyysgopkzygaitzw/sql).",
          tables: results,
          sql: SETUP_SQL,
        },
        { status: 200 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "All tables created successfully.",
    })
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Server error", error: String(err) },
      { status: 500 },
    )
  }
}
