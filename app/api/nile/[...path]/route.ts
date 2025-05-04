import { NextResponse } from "next/server"

// This API route has been disabled as we're only using Supabase
export async function GET() {
  return NextResponse.json(
    {
      error: "This API endpoint has been disabled. Please use Supabase instead.",
    },
    { status: 404 },
  )
}

export async function POST() {
  return NextResponse.json(
    {
      error: "This API endpoint has been disabled. Please use Supabase instead.",
    },
    { status: 404 },
  )
}

export async function PUT() {
  return NextResponse.json(
    {
      error: "This API endpoint has been disabled. Please use Supabase instead.",
    },
    { status: 404 },
  )
}

export async function DELETE() {
  return NextResponse.json(
    {
      error: "This API endpoint has been disabled. Please use Supabase instead.",
    },
    { status: 404 },
  )
}
