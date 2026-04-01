# Media Upload Setup & Configuration

## Overview
This document provides setup instructions for the Media Upload functionality that allows uploading project media to Supabase and retrieving it in project dashboards.

## Features
✅ Upload images, videos, and documents to Supabase storage
✅ Store metadata in database  
✅ Retrieve media by project ID
✅ Display media in project dashboards
✅ Support for multiple file types

## Supabase Database Setup

### 1. Create Storage Bucket
```sql
-- Create bucket via Supabase dashboard or API
CREATE BUCKET project-media;

-- Set bucket to public if you want direct URL access
-- Or keep private and use signed URLs
```

### 2. Create Media Metadata Table
```sql
CREATE TABLE project_media (
  id BIGSERIAL PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  public_url TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX idx_project_media_project_id ON project_media(project_id);
CREATE INDEX idx_project_media_uploaded_at ON project_media(uploaded_at DESC);
```

### 3. Enable Row Level Security (RLS)
```sql
ALTER TABLE project_media ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Users can view project media"
  ON project_media FOR SELECT
  USING (TRUE);

CREATE POLICY "Authenticated users can insert media"
  ON project_media FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
```

## Environment Variables Required
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## API Endpoints

### Upload Media
**Endpoint:** `POST /api/media/upload`

**Request:**
```
Content-Type: multipart/form-data

file: [binary file data]
projectId: "project-uuid"
```

**Response:**
```json
{
  "success": true,
  "file": {
    "name": "document.pdf",
    "url": "https://...",
    "projectId": "project-uuid",
    "uploadedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get Project Media
**Endpoint:** `GET /api/media/project?projectId=project-uuid`

**Response:**
```json
{
  "success": true,
  "projectId": "project-uuid",
  "count": 5,
  "media": [
    {
      "id": 1,
      "file_name": "image.jpg",
      "file_type": "image/jpeg",
      "file_size": 2048576,
      "public_url": "https://...",
      "uploaded_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

## Usage in Components

### Upload Page
```
/test-upload - Main media upload interface
- Select project
- Choose files
- Upload to Supabase
```

### Display in Dashboard
```typescript
// Fetch project media
const response = await fetch(`/api/media/project?projectId=${projectId}`)
const { media } = await response.json()

// Display in project dashboard/details page
{media.map(file => (
  <MediaItem key={file.id} file={file} />
))}
```

## Testing the Workflow

1. Navigate to `/test-upload`
2. Select a project
3. Upload media files
4. Verify files appear in project dashboard
5. Check Supabase dashboard for uploaded files

## Troubleshooting

**Issue:** "Bucket not found"
- Solution: Create `project-media` bucket in Supabase

**Issue:** "Table does not exist"
- Solution: Run the SQL migration to create `project_media` table

**Issue:** "Permission denied"
- Solution: Check RLS policies and ensure service role key is configured

**Issue:** Files upload but don't appear in dashboard
- Solution: Verify API route can access database, check browser console for errors

## Security Considerations

1. **File Validation:** Validate file types and sizes on both client and server
2. **Storage Limits:** Set bucket size limits in Supabase
3. **Access Control:** Use RLS policies to restrict access to authorized users
4. **Signed URLs:** For sensitive files, use signed URLs instead of public URLs
5. **Virus Scanning:** Consider adding virus scanning for uploaded files

## Performance Optimization

- Use CDN for file serving via Supabase
- Implement file compression before upload
- Add pagination for large media collections
- Cache media metadata in Redis if needed

## Next Steps

1. Complete Supabase setup (bucket + table)
2. Test upload functionality in `/test-upload`
3. Integrate media display in project dashboards
4. Add advanced features (sorting, filtering, deletion)
