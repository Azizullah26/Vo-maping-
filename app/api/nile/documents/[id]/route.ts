import type { NextRequest } from "next/server"
import { safeJsonResponse, withErrorHandling } from "@/lib/api-utils"
import { deleteDocument, executeQuery } from "@/lib/db"

/**
 * API route for getting a document by ID
 * GET /api/nile/documents/[id]
 */
export const GET = withErrorHandling(async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const { id } = params
    console.log(`GET /api/nile/documents/${id}: Getting document by ID`)

    const result = await executeQuery("SELECT * FROM documents WHERE id = $1", [id])

    if (result.rows.length === 0) {
      return safeJsonResponse(
        {
          success: false,
          message: `Document with ID ${id} not found`,
          timestamp: new Date().toISOString(),
        },
        404,
      )
    }

    return safeJsonResponse({
      success: true,
      data: result.rows[0],
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error getting document by ID:", error)
    return safeJsonResponse(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error getting document by ID",
        timestamp: new Date().toISOString(),
      },
      500,
    )
  }
})

/**
 * API route for deleting a document by ID
 * DELETE /api/nile/documents/[id]
 */
export const DELETE = withErrorHandling(async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const { id } = params
    console.log(`DELETE /api/nile/documents/${id}: Deleting document by ID`)

    const result = await deleteDocument(id)

    if (!result.success) {
      return safeJsonResponse(
        {
          success: false,
          message: result.message || `Failed to delete document with ID ${id}`,
          timestamp: new Date().toISOString(),
        },
        500,
      )
    }

    return safeJsonResponse({
      success: true,
      message: result.message,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error deleting document by ID:", error)
    return safeJsonResponse(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error deleting document by ID",
        timestamp: new Date().toISOString(),
      },
      500,
    )
  }
})
