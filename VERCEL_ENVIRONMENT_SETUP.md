✅ VERCEL ENVIRONMENT VARIABLES SETUP CHECKLIST

## Issue Detected
- Supabase environment variables added to Vercel but NOT being loaded
- Only MAPBOX_ACCESS_TOKEN is being recognized 
- SUPABASE_JWT_SECRET is missing from Vercel integration

## Required Environment Variables for Vercel Dashboard

Add these 9 variables to your Vercel Project Settings → Environment Variables:

### Supabase Public Variables
1. NEXT_PUBLIC_SUPABASE_URL=https://cfeggyysgopkzygaitzw.supabase.co
2. NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_tfbqgeRZ-TsFNP67InEi9Q_IZu6oVa2
3. NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_tfbqgeRZ-TsFNP67InEi9Q_IZu6oVa2

### Supabase Secret Variables (add to "Production" only if sensitive)
4. SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmZWdneXlzZ29wa3p5Z2FpdHp3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzczNTQxOSwiZXhwIjoyMDg5MzExNDE5fQ.TeZkTGZHz6pmj7vGuWiGiZJ5Il0r9M88fquJizWSTtk
5. SUPABASE_JWT_SECRET=your_jwt_secret_here

### Database Variables
6. POSTGRES_URL=postgres://postgres.pbqfgjzvclwgxgvuzmul:lOxrvMkSnvagpt8i@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require
7. POSTGRES_PRISMA_URL=postgres://postgres.pbqfgjzvclwgxgvuzmul:lOxrvMkSnvagpt8i@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require
8. POSTGRES_URL_NON_POOLING=postgres://postgres.pbqfgjzvclwgxgvuzmul:lOxrvMkSnvagpt8i@aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require

## Step-by-Step Instructions

1. Go to https://vercel.com/dashboard
2. Select your project "Vo-maping-"
3. Click Settings → Environment Variables
4. For each variable above:
   - Click "Add New"
   - Paste the name and value
   - Select "Production" (and "Preview" if needed)
   - Click "Save"
5. After adding ALL variables, click "Deploy" to redeploy

## Verification
After deployment, check debug logs:
- Should see: SUPABASE_URL, POSTGRES_URL in env keys
- Should NOT see only MAPBOX_ACCESS_TOKEN

## Common Issues
- Variables showing in local but not Vercel = Not added to dashboard
- Only seeing MAPBOX = Supabase variables not deployed yet
- "JWT Secret missing" = Need to add SUPABASE_JWT_SECRET

## Next Steps After Adding Variables
1. Wait for deployment to complete
2. Test: Visit /api/supabase-status endpoint
3. Should see full database connection info
4. Verify Media Upload functionality works
