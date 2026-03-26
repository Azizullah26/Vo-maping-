# Supabase Database Setup Instructions

Your app requires the `public.documents` and `public.projects` tables in Supabase. Follow these steps:

## Option 1: Manual Setup in Supabase Dashboard (Recommended)

1. Go to [Supabase Console](https://app.supabase.com) and log in
2. Select your project: `cfeggyysgopkzygaitzw`
3. Navigate to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy and paste the entire contents of `/scripts/setup-supabase.sql`
6. Click **Run**

## Option 2: Using the Setup Endpoint

Once your app is deployed:
1. Navigate to `https://your-app-url/api/setup-db`
2. Make a POST request (or just visit the URL)
3. The endpoint will create all necessary tables

## Environment Variables

Make sure these are set in your Vercel project settings:

```
NEXT_PUBLIC_SUPABASE_URL=https://cfeggyysgopkzygaitzw.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_tfbqgeRZ-TsFNP67InEi9Q_IZu6oVa2
SUPABASE_SERVICE_ROLE_KEY=(ask your Supabase admin)
```

## Tables Created

### public.documents
- `id` (UUID) - Primary key
- `project_id` (UUID) - Reference to projects
- `title` (TEXT) - Document name
- `url` (TEXT) - File URL
- `file_type` (TEXT) - MIME type
- `file_size` (INTEGER) - Size in bytes
- `uploaded_at` (TIMESTAMP)
- `description` (TEXT)
- `category` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### public.projects
- `id` (UUID) - Primary key
- `name` (TEXT) - Project name
- `description` (TEXT)
- `location` (TEXT)
- `latitude` (DECIMAL)
- `longitude` (DECIMAL)
- `city` (TEXT)
- `status` (TEXT)
- `image_url` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Verify Setup

After running the SQL, go to **Table Editor** and you should see both `documents` and `projects` tables listed.

Once complete, your app errors should disappear!
