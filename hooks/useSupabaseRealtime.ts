"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import type { RealtimeChannel, RealtimePostgresChangesPayload } from "@supabase/supabase-js"

interface RealtimeState<T> {
  data: T[]
  loading: boolean
  error: string | null
  connected: boolean
}

// Generic realtime hook
export function useSupabaseRealtime<T extends Record<string, any>>(table: string, initialData: T[] = []) {
  const [state, setState] = useState<RealtimeState<T>>({
    data: initialData,
    loading: true,
    error: null,
    connected: false,
  })

  const [channel, setChannel] = useState<RealtimeChannel | null>(null)

  const handleInsert = useCallback((payload: RealtimePostgresChangesPayload<T>) => {
    setState((prev) => ({
      ...prev,
      data: [payload.new as T, ...prev.data],
    }))
  }, [])

  const handleUpdate = useCallback((payload: RealtimePostgresChangesPayload<T>) => {
    setState((prev) => ({
      ...prev,
      data: prev.data.map((item) => (item.id === payload.new.id ? (payload.new as T) : item)),
    }))
  }, [])

  const handleDelete = useCallback((payload: RealtimePostgresChangesPayload<T>) => {
    setState((prev) => ({
      ...prev,
      data: prev.data.filter((item) => item.id !== payload.old.id),
    }))
  }, [])

  useEffect(() => {
    // Fetch initial data
    const fetchInitialData = async () => {
      try {
        const { data, error } = await supabase.from(table).select("*").order("created_at", { ascending: false })

        if (error) {
          setState((prev) => ({ ...prev, error: error.message, loading: false }))
          return
        }

        setState((prev) => ({ ...prev, data: data || [], loading: false }))
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : "Failed to fetch data",
          loading: false,
        }))
      }
    }

    fetchInitialData()

    // Set up realtime subscription
    const realtimeChannel = supabase
      .channel(`${table}_changes`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: table,
        },
        handleInsert,
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: table,
        },
        handleUpdate,
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: table,
        },
        handleDelete,
      )
      .subscribe((status) => {
        console.log(`Realtime subscription status for ${table}:`, status)
        setState((prev) => ({ ...prev, connected: status === "SUBSCRIBED" }))
      })

    setChannel(realtimeChannel)

    return () => {
      if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel)
      }
    }
  }, [table, handleInsert, handleUpdate, handleDelete])

  const refresh = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }))

    try {
      const { data, error } = await supabase.from(table).select("*").order("created_at", { ascending: false })

      if (error) {
        setState((prev) => ({ ...prev, error: error.message, loading: false }))
        return
      }

      setState((prev) => ({ ...prev, data: data || [], loading: false, error: null }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to refresh data",
        loading: false,
      }))
    }
  }, [table])

  return {
    ...state,
    refresh,
    channel,
  }
}

// Projects realtime hook
export function useProjectsRealtime() {
  return useSupabaseRealtime("projects")
}

// Documents realtime hook
export function useDocumentsRealtime(projectId?: string) {
  const baseResult = useSupabaseRealtime("documents")

  // Filter documents by project if projectId is provided
  const filteredData = projectId ? baseResult.data.filter((doc: any) => doc.project_id === projectId) : baseResult.data

  return {
    ...baseResult,
    data: filteredData,
  }
}

export default useSupabaseRealtime
