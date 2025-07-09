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

// Generic realtime hook
export function useSupabaseRealtime<T>(table: string, filter?: { column: string; value: any }) {
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

        if (error) throw error

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
              filter: filter ? `${filter.column}=eq.${filter.value}` : undefined,
            },
            (payload) => {
              setState((prev) => {
                let newData = [...prev.data]

                switch (payload.eventType) {
                  case "INSERT":
                    newData.push(payload.new as T)
                    break
                  case "UPDATE":
                    const updateIndex = newData.findIndex((item: any) => item.id === payload.new.id)
                    if (updateIndex !== -1) {
                      newData[updateIndex] = payload.new as T
                    }
                    break
                  case "DELETE":
                    newData = newData.filter((item: any) => item.id !== payload.old.id)
                    break
                }

                return {
                  ...prev,
                  data: newData,
                }
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
          loading: false,
          error: error instanceof Error ? error.message : "Failed to setup realtime",
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

// Projects realtime hook
export function useProjectsRealtime() {
  return useSupabaseRealtime<any>("projects")
}

// Documents realtime hook
export function useDocumentsRealtime(projectId?: string) {
  const filter = projectId ? { column: "project_id", value: projectId } : undefined
  return useSupabaseRealtime<any>("documents", filter)
}
