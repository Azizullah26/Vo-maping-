"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const MANUAL_SQL = `-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/cfeggyysgopkzygaitzw/sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

-- projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL, name_ar TEXT, description TEXT,
  status TEXT NOT NULL DEFAULT 'planned',
  location TEXT, latitude DOUBLE PRECISION, longitude DOUBLE PRECISION,
  image_url TEXT, start_date TIMESTAMPTZ, end_date TIMESTAMPTZ,
  budget TEXT, progress INTEGER DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  manager TEXT, manager_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
DROP TRIGGER IF EXISTS projects_updated_at ON projects;
CREATE TRIGGER projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Public read projects"   ON projects FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public insert projects" ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Public update projects" ON projects FOR UPDATE USING (true);
CREATE POLICY IF NOT EXISTS "Public delete projects" ON projects FOR DELETE USING (true);

-- documents
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL, file_name TEXT, file_url TEXT, file_type TEXT,
  size BIGINT DEFAULT 0, project_name TEXT, description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
DROP TRIGGER IF EXISTS documents_updated_at ON documents;
CREATE TRIGGER documents_updated_at BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Public read documents"   ON documents FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public insert documents" ON documents FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Public update documents" ON documents FOR UPDATE USING (true);
CREATE POLICY IF NOT EXISTS "Public delete documents" ON documents FOR DELETE USING (true);

-- project_documents
CREATE TABLE IF NOT EXISTS project_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  project_name TEXT, file_name TEXT NOT NULL,
  file_url TEXT, file_type TEXT, size BIGINT DEFAULT 0, description TEXT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE project_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Public read project_documents"   ON project_documents FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public insert project_documents" ON project_documents FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Public update project_documents" ON project_documents FOR UPDATE USING (true);
CREATE POLICY IF NOT EXISTS "Public delete project_documents" ON project_documents FOR DELETE USING (true);`

type TableStatus = Record<string, string>

interface SetupResult {
  success: boolean
  message: string
  tables?: TableStatus
  sql?: string
  error?: string
}

export default function SetupPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle")
  const [result, setResult] = useState<SetupResult | null>(null)
  const [copied, setCopied] = useState(false)

  async function runSetup() {
    setStatus("loading")
    try {
      const res = await fetch("/api/setup-database")
      const data: SetupResult = await res.json()
      setResult(data)
      setStatus(data.success ? "done" : "error")
    } catch (e) {
      setResult({ success: false, message: String(e) })
      setStatus("error")
    }
  }

  function copySQL() {
    navigator.clipboard.writeText(MANUAL_SQL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="min-h-screen bg-background flex items-start justify-center p-8">
      <div className="w-full max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Database Setup</h1>
          <p className="text-muted-foreground mt-1">
            Create the required tables in your Supabase project{" "}
            <code className="text-xs bg-muted px-1 py-0.5 rounded">cfeggyysgopkzygaitzw</code>.
          </p>
        </div>

        {/* Auto setup */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Option 1 — Auto Setup</CardTitle>
            <CardDescription>
              Click the button to create all tables automatically via the API.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={runSetup} disabled={status === "loading"}>
              {status === "loading" ? "Setting up..." : "Create Tables"}
            </Button>

            {result && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant={result.success ? "default" : "destructive"}>
                    {result.success ? "Success" : "Needs manual step"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{result.message}</span>
                </div>

                {result.tables && (
                  <div className="rounded-md border divide-y text-sm">
                    {Object.entries(result.tables).map(([table, state]) => (
                      <div key={table} className="flex items-center justify-between px-3 py-2">
                        <span className="font-mono">{table}</span>
                        <Badge variant={state === "exists" ? "default" : "destructive"}>
                          {state}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Manual setup */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Option 2 — Manual SQL</CardTitle>
            <CardDescription>
              Copy this SQL and run it in the{" "}
              <a
                href="https://supabase.com/dashboard/project/cfeggyysgopkzygaitzw/sql"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-foreground"
              >
                Supabase SQL Editor
              </a>
              .
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" onClick={copySQL}>
              {copied ? "Copied!" : "Copy SQL"}
            </Button>
            <pre className="text-xs bg-muted p-4 rounded-md overflow-auto max-h-64 leading-relaxed">
              {MANUAL_SQL}
            </pre>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground">
          Tables created: <code>projects</code>, <code>documents</code>,{" "}
          <code>project_documents</code>. RLS is enabled with public read/write policies.
        </p>
      </div>
    </main>
  )
}
