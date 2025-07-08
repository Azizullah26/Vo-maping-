"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import type { RealtimeChannel } from "@supabase/supabase-js"

export interface RealtimeOptions {
  table: string
  filter?: string
  onInsert?: (payload: any) => void
  onUpdate?: (payload: any) => void
  onDelete?: (payload: any) => void
}

export function useSupabaseRealtime(options: RealtimeOptions) {
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)

  const { table, filter, onInsert, onUpdate, onDelete } = options

  const subscribe = useCallback(() => {
    try {
      // Create channel name
      const channelName = filter ? `${table}:${filter}` : table

      // Create new channel
      const newChannel = supabase.channel(channelName)

      // Set up table listeners
      const channelBuilder = newChannel.on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: table,
          ...(filter && { filter }),
        },
        (payload) => {
          console.log("Realtime payload:", payload)

          switch (payload.eventType) {
            case "INSERT":
              onInsert?.(payload)
              break
            case "UPDATE":
              onUpdate?.(payload)
              break
            case "DELETE":
              onDelete?.(payload)
              break
          }
        },
      )

      // Subscribe to channel
      channelBuilder.subscribe((status) => {
        console.log("Realtime subscription status:", status)

        if (status === "SUBSCRIBED") {
          setIsConnected(true)
          setError(null)
        } else if (status === "CHANNEL_ERROR") {
          setIsConnected(false)
          setError("Failed to connect to realtime channel")
        } else if (status === "TIMED_OUT") {
          setIsConnected(false)
          setError("Realtime connection timed out")
        }
      })

      setChannel(newChannel)
    } catch (error) {
      console.error("Error setting up realtime subscription:", error)
      setError(error instanceof Error ? error.message : "Unknown error")
    }
  }, [table, filter, onInsert, onUpdate, onDelete])

  const unsubscribe = useCallback(() => {
    if (channel) {
      supabase.removeChannel(channel)
      setChannel(null)
      setIsConnected(false)
      setError(null)
    }
  }, [channel])

  useEffect(() => {
    subscribe()

    return () => {
      unsubscribe()
    }
  }, [subscribe, unsubscribe])

  return {
    isConnected,
    error,
    subscribe,
    unsubscribe,
  }
}

// Hook for projects realtime updates
export function useProjectsRealtime(onProjectChange?: (project: any) => void) {
  return useSupabaseRealtime({
    table: "projects",
    onInsert: (payload) => {
      console.log("New project created:", payload.new)
      onProjectChange?.(payload.new)
    },
    onUpdate: (payload) => {
      console.log("Project updated:", payload.new)
      onProjectChange?.(payload.new)
    },
    onDelete: (payload) => {
      console.log("Project deleted:", payload.old)
      onProjectChange?.(payload.old)
    },
  })
}

// Hook for documents realtime updates
export function useDocumentsRealtime(projectId?: string, onDocumentChange?: (document: any) => void) {
  return useSupabaseRealtime({
    table: "documents",
    filter: projectId ? `project_id=eq.${projectId}` : undefined,
    onInsert: (payload) => {
      console.log("New document created:", payload.new)
      onDocumentChange?.(payload.new)
    },
    onUpdate: (payload) => {
      console.log("Document updated:", payload.new)
      onDocumentChange?.(payload.new)
    },
    onDelete: (payload) => {
      console.log("Document deleted:", payload.old)
      onDocumentChange?.(payload.old)
    },
  })
}
