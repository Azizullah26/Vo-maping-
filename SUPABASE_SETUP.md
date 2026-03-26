# Supabase Setup Instructions

Your app is connected to Supabase, but the database tables need to be created. Follow these steps:

## Option 1: Automatic Setup (Recommended)

1. **Deploy your app to Vercel** (if not already deployed)
2. **Visit**: `https://your-app-url/api/setup-db`
3. Make a **POST request** to initialize the database
4. You should see a success message

## Option 2: Manual Setup in Supabase Dashboard

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **SQL Editor**
4. Create the tables by running this SQL:

```sql
-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  location TEXT,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'Active',
  progress INTEGER DEFAULT 0,
  budget TEXT,
  manager TEXT,
  manager_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create documents table
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

-- Create storage bucket for documents
-- (This must be done via Supabase UI or API, not SQL)
```

## Environment Variables Check

Make sure these are set in your Vercel project:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Your service role key (for backend operations)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your anon key (for frontend operations)

To find these:
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings → API**
4. Copy the URLs and keys

## Troubleshooting

**Error: "Could not find the table 'public.documents'"**
- The table hasn't been created yet
- Use Option 1 or Option 2 above to create it

**Error: "Missing Supabase credentials"**
- Check that `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set
- Verify they're in your Vercel project settings

**App still showing errors after initialization**
- Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)
- Restart your development server or redeploy to Vercel
