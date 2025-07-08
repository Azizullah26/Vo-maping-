"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { RealtimeChannel } from "@supabase/supabase-js"

export function useSupabaseRealtime<T>(table: string, initialData: T[] = []) {
  const [data, setData] = useState<T[]>(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let channel: RealtimeChannel

    const setupRealtime = async () => {
      try {
        setLoading(true)

        // Fetch initial data
        const { data: initialData, error: fetchError } = await supabase
          .from(table)
          .select("*")
          .order("created_at", { ascending: false })

        if (fetchError) {
          setError(fetchError.message)
          return
        }

        setData(initialData as T[])

        // Set up real-time subscription
        channel = supabase
          .channel(`${table}_changes`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: table,
            },
            (payload) => {
              console.log("Real-time change received:", payload)

              if (payload.eventType === "INSERT") {
                setData((current) => [payload.new as T, ...current])
              } else if (payload.eventType === "UPDATE") {
                setData((current) =>
                  current.map((item) => ((item as any).id === (payload.new as any).id ? (payload.new as T) : item)),
                )
              } else if (payload.eventType === "DELETE") {
                setData((current) => current.filter((item) => (item as any).id !== (payload.old as any).id))
              }
            },
          )
          .subscribe()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    setupRealtime()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [table])

  return { data, loading, error }
}
