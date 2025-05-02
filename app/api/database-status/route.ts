import { NextResponse } from "next/server"
import { testConnection, getAllDocuments, getProjectDocuments } from "@/lib/serverless-db"

export async function GET() {
  try {
    // Test database connection
    const connectionResult = await testConnection()

    // Get some basic stats
    let documentCount = 0
    let projectDocuments = []

    if (connectionResult.success) {
      // Try to get all documents
      const documentsResult = await getAllDocuments()
      if (documentsResult.success && documentsResult.data) {
        documentCount = documentsResult.data.length
      }

      // Try to get documents for a specific project (using ID 1 as an example)
      const projectResult = await getProjectDocuments("1")
      if (projectResult.success && projectResult.data) {
        projectDocuments = projectResult.data
      }
    }

    return NextResponse.json({
      success: true,
      connection: connectionResult,
      stats: {
        totalDocuments: documentCount,
        projectDocumentsExample:
          projectDocuments.length > 0
            ? `Found ${projectDocuments.length} documents for project ID 1`
            : "No documents found for project ID 1",
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in database status check:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error checking database status",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
