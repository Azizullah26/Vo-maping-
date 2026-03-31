# Supabase Setup and Connection Guide

## ✅ Supabase Configuration Complete

All Supabase environment variables have been configured in `.env.local`:

### Configuration Status

- ✅ **NEXT_PUBLIC_SUPABASE_URL** - `https://cfeggyysgopkzygaitzw.supabase.co`
- ✅ **NEXT_PUBLIC_SUPABASE_ANON_KEY** - Configured
- ✅ **SUPABASE_SERVICE_ROLE_KEY** - Configured
- ✅ **Database URLs** - All connection strings configured
- ✅ **PostgreSQL Credentials** - Host, password, user, database all set
- ✅ **Mapbox Token** - Configured

## 🔍 Checking Connection

### Via API Endpoint

Test the connection by visiting:
```
http://localhost:3000/api/supabase-status
```

This endpoint will return:
- Connection status
- Available tables in the database
- Credential validation
- Service role key status

### Expected Response (Success)

```json
{
  "connected": true,
  "message": "Successfully connected to Supabase",
  "url": "https://cfeggyysgopkzygaitzw.supabase.co",
  "hasServiceRole": true,
  "tables": [...],
  "credentials": {
    "url": true,
    "anonKey": true,
    "serviceRoleKey": true
  }
}
```

## 📊 Database Tables

To check available tables in your Supabase database:

1. Go to https://supabase.com/dashboard
2. Log in to your project
3. Navigate to the **SQL Editor** tab
4. Run:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

## 🔧 Usage in Code

### Client-Side (Anon Key)

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Fetch data
const { data, error } = await supabase.from('table_name').select('*')
```

### Server-Side (Service Role Key)

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Full admin access
const { data, error } = await supabase.from('table_name').select('*')
```

## 🚀 Ready to Use

The following components/hooks are ready to use:

- **`useSupabaseConnection()`** - Hook to check connection status
- **`SupabaseConnectionStatus`** - Component to display connection status
- **`/api/supabase-status`** - API endpoint to check server connection

## 📝 Environment Variables Breakdown

| Variable | Purpose | Value |
|----------|---------|-------|
| NEXT_PUBLIC_SUPABASE_URL | Supabase project URL | https://cfeggyysgopkzygaitzw.supabase.co |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Public anon key for client | sb_publishable_tfbqgeRZ-... |
| SUPABASE_SERVICE_ROLE_KEY | Admin key for server operations | eyJhbGc... |
| DATABASE_URL | Direct PostgreSQL connection | postgres://... |
| POSTGRES_URL | Pooled connection string | postgres://... |
| POSTGRES_URL_NON_POOLING | Non-pooled connection | postgres://... |
| POSTGRES_PRISMA_URL | Prisma ORM connection | postgres://... |
| MAPBOX_ACCESS_TOKEN | Mapbox API token | pk.eyJ... |

## ⚠️ Important Notes

1. **Never commit `.env.local`** - Keep credentials private
2. **Service Role Key** - Use only on server-side, never expose to clients
3. **Connection Pooling** - Use `POSTGRES_URL` for production apps
4. **Direct Connection** - Use `POSTGRES_URL_NON_POOLING` for migrations

## 🔐 Security Checklist

- ✅ Credentials configured in `.env.local`
- ✅ Service role key is server-side only
- ✅ Anon key is safe for public use
- ✅ RLS policies should be configured in Supabase dashboard
- ✅ Database connection uses SSL/TLS (`sslmode=require`)

## ✨ Next Steps

1. Verify connection: Visit `/api/supabase-status`
2. Create tables in Supabase dashboard
3. Set up Row Level Security (RLS) policies
4. Start using Supabase in your app components

## 🆘 Troubleshooting

### Connection Failed

1. Check environment variables in `.env.local`
2. Verify Supabase project is active
3. Check network connectivity
4. Review API route logs: `npm run dev` console output

### Table Not Found

1. Ensure table exists in Supabase dashboard
2. Check table name spelling (case-sensitive)
3. Verify user has access via RLS policies

### Authentication Error

1. Verify anon key has correct permissions
2. Check RLS policies allow the operation
3. Use service role key for admin operations

For more help, visit: https://supabase.com/docs
