import { Pool } from "pg"

// Initialize Neon PostgreSQL connection
const neonPool = new Pool({
  connectionString: process.env.NEON_POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

export interface Document {
  id: string
  project_id: string
  project_name: string
  file_name: string
  file_url: string
  type: string
  size: number
  document_type: string
  created_at: string
  updated_at: string
}

/**
 * Get all documents
 */
export async function getAllDocuments(): Promise<Document[]> {
  const client = await neonPool.connect()
  try {
    const result = await client.query(`
      SELECT * FROM documents
      ORDER BY created_at DESC
    `)
    return result.rows
  } finally {
    client.release()
  }
}

/**
 * Get documents by project ID
 */
export async function getDocumentsByProject(projectId: string): Promise<Document[]> {
  const client = await neonPool.connect()
  try {
    const result = await client.query(
      `
      SELECT * FROM documents
      WHERE project_id = $1
      ORDER BY created_at DESC
      `,
      [projectId],
    )
    return result.rows
  } finally {
    client.release()
  }
}

/**
 * Delete a document by ID
 */
export async function deleteDocument(id: string): Promise<boolean> {
  const client = await neonPool.connect()
  try {
    // First get the document to find the file path
    const docResult = await client.query(
      `
      SELECT file_path FROM documents
      WHERE id = $1
      `,
      [id],
    )

    if (docResult.rows.length === 0) {
      return false
    }

    // Delete from database
    await client.query(
      `
      DELETE FROM documents
      WHERE id = $1
      `,
      [id],
    )

    return true
  } finally {
    client.release()
  }
}
