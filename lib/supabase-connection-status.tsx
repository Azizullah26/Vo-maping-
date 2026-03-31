'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

interface ConnectionStatus {
  connected: boolean
  message: string
  tables?: string[]
  error?: string
}

export function useSupabaseConnection() {
  const [status, setStatus] = useState<ConnectionStatus>({
    connected: false,
    message: 'Checking connection...',
  })

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        console.log('[v0] Supabase URL exists:', !!supabaseUrl)
        console.log('[v0] Supabase Key exists:', !!supabaseKey)

        if (!supabaseUrl || !supabaseKey) {
          setStatus({
            connected: false,
            message: 'Missing Supabase credentials',
            error: 'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required',
          })
          return
        }

        const supabase = createClient(supabaseUrl, supabaseKey)

        // Test the connection by querying the auth status
        const { data: authData, error: authError } = await supabase.auth.getSession()

        if (authError) {
          console.error('[v0] Auth error:', authError)
        }

        // Try to fetch the tables metadata
        const { data: tablesData, error: tablesError } = await supabase
          .from('information_schema.tables')
          .select('table_name')
          .eq('table_schema', 'public')
          .limit(10)

        if (tablesError) {
          console.log('[v0] Could not fetch tables:', tablesError.message)
        }

        console.log('[v0] Connection successful')
        setStatus({
          connected: true,
          message: 'Successfully connected to Supabase',
          tables: tablesData?.map((t: any) => t.table_name) || [],
        })
      } catch (error) {
        console.error('[v0] Connection error:', error)
        setStatus({
          connected: false,
          message: 'Failed to connect to Supabase',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    checkConnection()
  }, [])

  return status
}

export default function SupabaseConnectionStatus() {
  const status = useSupabaseConnection()

  return (
    <div className="p-4 rounded-lg border">
      <div className="flex items-center gap-2 mb-2">
        <div
          className={`w-3 h-3 rounded-full ${
            status.connected ? 'bg-green-500' : 'bg-red-500'
          }`}
        ></div>
        <h3 className="font-semibold">Supabase Connection</h3>
      </div>
      <p className="text-sm text-gray-600 mb-2">{status.message}</p>
      {status.error && (
        <p className="text-sm text-red-600 mb-2">Error: {status.error}</p>
      )}
      {status.tables && status.tables.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-1">Available Tables:</p>
          <ul className="text-sm text-gray-600">
            {status.tables.map((table) => (
              <li key={table}>• {table}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
