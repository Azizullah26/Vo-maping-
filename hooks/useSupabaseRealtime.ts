"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { RealtimeChannel } from "@supabase/supabase-js"

interface RealtimeState<T> {
  data: T[]
  loading: boolean
  error: string | null
  connected: boolean
}

export function useSupabaseRealtime<T = any>(table: string, filter?: { column: string; value: any }) {
  const [state, setState] = useState<RealtimeState<T>>({
    data: [],
    loading: true,
    error: null,
    connected: false,
  })

  useEffect(() => {
    let channel: RealtimeChannel

    const setupRealtime = async () => {
      try {
        // Initial data fetch
        let query = supabase.from(table).select("*")

        if (filter) {
          query = query.eq(filter.column, filter.value)
        }

        const { data, error } = await query

        if (error) {
          setState((prev) => ({ ...prev, error: error.message, loading: false }))
          return
        }

        setState((prev) => ({
          ...prev,
          data: data || [],
          loading: false,
          error: null,
        }))

        // Setup realtime subscription
        channel = supabase
          .channel(`${table}_changes`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: table,
              ...(filter && { filter: `${filter.column}=eq.${filter.value}` }),
            },
            (payload) => {
              setState((prev) => {
                let newData = [...prev.data]

                switch (payload.eventType) {
                  case "INSERT":
                    newData.push(payload.new as T)
                    break
                  case "UPDATE":
                    newData = newData.map((item) =>
                      (item as any).id === (payload.new as any).id ? (payload.new as T) : item,
                    )
                    break
                  case "DELETE":
                    newData = newData.filter((item) => (item as any).id !== (payload.old as any).id)
                    break
                }

                return { ...prev, data: newData }
              })
            },
          )
          .subscribe((status) => {
            setState((prev) => ({
              ...prev,
              connected: status === "SUBSCRIBED",
            }))
          })
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : "Unknown error",
          loading: false,
        }))
      }
    }

    setupRealtime()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [table, filter]) // Updated dependency array

  return state
}

export function useProjectsRealtime() {
  return useSupabaseRealtime("projects")
}

export function useDocumentsRealtime(projectId?: string) {
  return useSupabaseRealtime("documents", projectId ? { column: "project_id", value: projectId } : undefined)
}
