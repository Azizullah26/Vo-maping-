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
export function useSupabaseRealtime<T = any>(table: string, callback: (payload: any) => void) {
  const [state, setState] = useState<RealtimeState<T>>({
    data: [],
    loading: true,
    error: null,
    connected: false,
  })

  const [channel, setChannel] = useState<RealtimeChannel | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      const { data, error } = await supabase.from(table).select("*").order("created_at", { ascending: false })

      if (error) throw error

      setState((prev) => ({
        ...prev,
        data: data || [],
        loading: false,
      }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch data",
      }))
    }
  }, [table])

  useEffect(() => {
    fetchData()

    // Set up realtime subscription
    const channelName = table

    const newChannel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: table,
        },
        (payload) => {
          console.log("Realtime update:", payload)
          callback(payload)

          setState((prev) => {
            let newData = [...prev.data]

            switch (payload.eventType) {
              case "INSERT":
                newData.unshift(payload.new as T)
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

    setChannel(newChannel)

    return () => {
      if (newChannel) {
        supabase.removeChannel(newChannel)
      }
    }
  }, [table, fetchData, callback])

  const refresh = useCallback(() => {
    fetchData()
  }, [fetchData])

  return {
    ...state,
    refresh,
    channel,
  }
}

// Projects realtime hook
export function useProjectsRealtime(callback: (payload: any) => void) {
  return useSupabaseRealtime("projects", callback)
}

// Documents realtime hook
export function useDocumentsRealtime(projectId?: string, callback: (payload: any) => void) {
  const filter = projectId ? { column: "project_id", value: projectId } : undefined
  return useSupabaseRealtime("documents", callback)
}
