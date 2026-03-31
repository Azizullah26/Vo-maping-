import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    console.log('[v0] Checking Supabase connection...')
    console.log('[v0] URL:', !!supabaseUrl)
    console.log('[v0] Anon Key:', !!supabaseKey)
    console.log('[v0] Service Role Key:', !!serviceRoleKey)

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        {
          connected: false,
          message: 'Missing Supabase credentials',
          error: 'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required',
        },
        { status: 400 }
      )
    }

    // Create client with anon key
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Test the connection
    const { data: authData, error: authError } = await supabase.auth.getSession()

    if (authError && authError.message !== 'Auth session missing!') {
      console.error('[v0] Auth error:', authError)
      return NextResponse.json(
        {
          connected: false,
          message: 'Failed to authenticate with Supabase',
          error: authError.message,
        },
        { status: 500 }
      )
    }

    // Try to query a table to verify database connection
    let tables: string[] = []
    try {
      // Use service role key for better access
      const adminSupabase = serviceRoleKey
        ? createClient(supabaseUrl, serviceRoleKey)
        : supabase

      const { data: tablesData, error: tablesError } = await adminSupabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .limit(50)

      if (!tablesError && tablesData) {
        tables = tablesData.map((t: any) => t.table_name)
      }
    } catch (e) {
      console.log('[v0] Could not fetch tables list')
    }

    console.log('[v0] Supabase connection successful')
    console.log('[v0] Found tables:', tables.length)

    return NextResponse.json({
      connected: true,
      message: 'Successfully connected to Supabase',
      url: supabaseUrl,
      hasServiceRole: !!serviceRoleKey,
      tables: tables,
      credentials: {
        url: !!supabaseUrl,
        anonKey: !!supabaseKey,
        serviceRoleKey: !!serviceRoleKey,
      },
    })
  } catch (error) {
    console.error('[v0] Supabase connection error:', error)
    return NextResponse.json(
      {
        connected: false,
        message: 'Failed to connect to Supabase',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
