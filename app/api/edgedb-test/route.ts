import { NextResponse } from "next/server"
import * as edgedb from "edgedb"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // Check if EdgeDB is configured
    const edgedbInstance = process.env.EDGEDB_INSTANCE
    const edgedbSecretKey = process.env.EDGEDB_SECRET_KEY

    if (!edgedbInstance || !edgedbSecretKey) {
      return NextResponse.json(
        {
          success: false,
          message: "EdgeDB environment variables not configured",
          error: "Missing EDGEDB_INSTANCE or EDGEDB_SECRET_KEY",
        },
        { status: 500 },
      )
    }

    // The environment variables EDGEDB_INSTANCE and EDGEDB_SECRET_KEY
    // are automatically picked up by createClient() when running on Vercel.
    const client = edgedb.createClient({
      instanceName: edgedbInstance,
      secretKey: edgedbSecretKey,
    })

    await client.ensureConnected()

    // Run a simple query to test the connection
    const result = await client.querySingle("select 1 + 1")

    await client.close()

    if (result === 2) {
      return NextResponse.json({
        success: true,
        message: "Successfully connected to EdgeDB and executed a query.",
        queryResult: result,
        instance: edgedbInstance.split("/").pop(), // Only show the database name, not full path
      })
    } else {
      throw new Error("Query execution returned an unexpected result.")
    }
  } catch (error: any) {
    console.error("EdgeDB connection error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to connect to EdgeDB.",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
