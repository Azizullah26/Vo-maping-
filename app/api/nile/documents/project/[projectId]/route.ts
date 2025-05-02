import type { NextRequest } from "next/server"
import { safeJsonResponse, withErrorHandling } from "@/lib/api-utils"
import { getDocumentsByProject } from "@/lib/db"

/**
 * API route for getting documents by project ID
 * GET /api/nile/documents/project/[projectId]
 */
export const GET = withErrorHandling(async (req: NextRequest, { params }: { params: { projectId: string } }) => {
  try {
    const { projectId } = params
    console.log(`GET /api/nile/documents/project/${projectId}: Getting documents by project ID`)

    const result = await getDocumentsByProject(projectId)

    if (!result.success) {
      return safeJsonResponse(
        {
          success: false,
          message: result.message || `Failed to get documents for project ${projectId}`,
          timestamp: new Date().toISOString(),
        },
        500,
      )
    }

    return safeJsonResponse({
      success: true,
      data: result.data,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error getting documents by project ID:", error)
    return safeJsonResponse(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error getting documents by project ID",
        timestamp: new Date().toISOString(),
      },
      500,
    )
  }
})
