"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import type { RealtimeChannel } from "@supabase/supabase-js"

interface RealtimeState<T> {
  data: T[]
  loading: boolean
  error: string | null
  connected: boolean
}

// Generic realtime hook
export function useSupabaseRealtime<T = any>(table: string, filter?: { column: string; value: any }) {
  const [state, setState] = useState<RealtimeState<T>>({
    data: [],
    loading: true,
    error: null,
    connected: false,
  })

  const [channel, setChannel] = useState<RealtimeChannel | null>(null)

  const fetchInitialData = useCallback(async () => {
    try {
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
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch data",
      }))
    }
  }, [table, filter])

  useEffect(() => {
    fetchInitialData()

    // Set up realtime subscription
    const channelName = filter ? `${table}_${filter.column}_${filter.value}` : table

    const newChannel = supabase
      .channel(channelName)
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
                newData = [payload.new as T, ...newData]
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

    setChannel(newChannel)

    return () => {
      if (newChannel) {
        supabase.removeChannel(newChannel)
      }
    }
  }, [table, filter, fetchInitialData])

  const refresh = useCallback(() => {
    fetchInitialData()
  }, [fetchInitialData])

  return {
    ...state,
    refresh,
  }
}

// Projects realtime hook
export function useProjectsRealtime() {
  return useSupabaseRealtime("projects")
}

// Documents realtime hook
export function useDocumentsRealtime(projectId?: string) {
  const filter = projectId ? { column: "project_id", value: projectId } : undefined
  return useSupabaseRealtime("documents", filter)
}
