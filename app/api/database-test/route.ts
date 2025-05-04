import { NextResponse } from "next/server"
import { testDatabaseConnections } from "@/lib/db-client"
import { getAllDocuments } from "@/lib/document-service"
import { setCache, getCache } from "@/lib/cache-service"

export async function GET() {
  try {
    // Test all database connections
    const connectionResults = await testDatabaseConnections()

    // Test document retrieval
    const documents = await getAllDocuments()

    // Test cache operations
    const cacheKey = "database-test"
    const cacheValue = { timestamp: new Date().toISOString() }
    const cacheSet = await setCache(cacheKey, cacheValue)
    const cacheGet = await getCache(cacheKey)

    return NextResponse.json({
      success: true,
      connections: connectionResults,
      documents: {
        count: documents.length,
        sample: documents.slice(0, 2),
      },
      cache: {
        set: cacheSet,
        get: cacheGet,
      },
    })
  } catch (error) {
    console.error("Error in database test:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
