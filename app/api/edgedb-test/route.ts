import { NextResponse } from "next/server"
import * as edgedb from "edgedb"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // The environment variables EDGEDB_INSTANCE and EDGEDB_SECRET_KEY
    // are automatically picked up by createClient() when running on Vercel.
    const client = edgedb.createClient()

    await client.ensureConnected()

    // Run a simple query to test the connection
    const result = await client.querySingle("select 1 + 1")

    await client.close()

    if (result === 2) {
      return NextResponse.json({
        success: true,
        message: "Successfully connected to EdgeDB and executed a query.",
        queryResult: result,
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
