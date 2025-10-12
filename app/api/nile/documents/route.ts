import type { NextRequest } from "next/server"
import { safeJsonResponse, withErrorHandling } from "@/lib/api-utils"
import { getAllDocuments, addDocument } from "@/lib/db"

/**
 * API route for getting all documents
 * GET /api/nile/documents
 */
export const GET = withErrorHandling(async (req: NextRequest) => {
  try {
    console.log("GET /api/nile/documents: Getting all documents")

    const result = await getAllDocuments()

    if (!result.success) {
      return safeJsonResponse(
        {
          success: false,
          message: result.message || "Failed to get documents",
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
    console.error("Error getting documents:", error)
    return safeJsonResponse(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error getting documents",
        timestamp: new Date().toISOString(),
      },
      500,
    )
  }
})

/**
 * API route for adding a document
 * POST /api/nile/documents
 */
export const POST = withErrorHandling(async (req: NextRequest) => {
  try {
    console.log("POST /api/nile/documents: Adding a document")

    // For multipart form data, we need to handle it differently
    const formData = await req.formData()

    const file = formData.get("file") as File
    if (!file) {
      return safeJsonResponse(
        {
          success: false,
          message: "No file provided",
          timestamp: new Date().toISOString(),
        },
        400,
      )
    }

    const projectId = formData.get("projectId") as string
    const projectName = formData.get("projectName") as string
    const documentType = formData.get("documentType") as string

    if (!projectId || !projectName) {
      return safeJsonResponse(
        {
          success: false,
          message: "Project ID and name are required",
          timestamp: new Date().toISOString(),
        },
        400,
      )
    }

    // In a real implementation, you would upload the file to a storage service
    // and get a URL back. For this example, we'll simulate that.
    const fileUrl = `https://example.com/files/${file.name}`

    // Add document to database
    const result = await addDocument({
      name: file.name,
      type: documentType || file.type,
      size: file.size,
      file_path: fileUrl,
      project_id: projectId,
      project_name: projectName,
    })

    if (!result.success) {
      return safeJsonResponse(
        {
          success: false,
          message: result.message || "Failed to add document",
          timestamp: new Date().toISOString(),
        },
        500,
      )
    }

    return safeJsonResponse({
      success: true,
      data: {
        id: result.data.id,
        name: result.data.name,
        url: result.data.file_path,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error adding document:", error)
    return safeJsonResponse(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error adding document",
        timestamp: new Date().toISOString(),
      },
      500,
    )
  }
})
