import { type NextRequest, NextResponse } from "next/server"
import { getNileServerSingleton } from "@/lib/nile"

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  const nile = await getNileServerSingleton()
  return handleNileRequest(nile, request, params.path)
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  const nile = await getNileServerSingleton()
  return handleNileRequest(nile, request, params.path)
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
  const nile = await getNileServerSingleton()
  return handleNileRequest(nile, request, params.path)
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
  const nile = await getNileServerSingleton()
  return handleNileRequest(nile, request, params.path)
}

async function handleNileRequest(
  nile: Awaited<ReturnType<typeof getNileServerSingleton>>,
  request: NextRequest,
  pathSegments: string[],
) {
  try {
    // Join the path segments to form the complete path
    const path = pathSegments.join("/")

    // Get the Nile API handler
    const handler = nile.api

    // Call the appropriate method based on the request method
    const response = await handler(path, {
      method: request.method,
      headers: Object.fromEntries(request.headers),
      body: request.body ? await request.text() : undefined,
    })

    return new NextResponse(response.body, {
      status: response.status,
      headers: response.headers,
    })
  } catch (error) {
    console.error("Nile API error:", error)
    return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}
