import { NextResponse } from 'next/server';

/**
 * Simple setup endpoint to initialize database on first load
 * Forwards to the main init-supabase-tables endpoint
 */
export async function GET() {
  const response = NextResponse.json({
    success: true,
    message: 'Database setup endpoint. POST to initialize tables.',
    instructions: 'Call POST /api/init-supabase-tables to initialize your Supabase database.',
  });
  return response;
}

export async function POST() {
  try {
    // Call the init endpoint
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';
    
    const initResponse = await fetch(`${baseUrl}/api/init-supabase-tables`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await initResponse.json();
    return NextResponse.json(data, { status: initResponse.status });
  } catch (error) {
    console.error('Error initializing database:', error);
    return NextResponse.json(
      {
        success: false,
        message: `Error initializing database: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
      { status: 500 },
    );
  }
}
