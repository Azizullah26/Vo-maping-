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
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { table, filter, onInsert, onUpdate, onDelete } = options

  const subscribe = useCallback(() => {
    try {
      const channelName = `realtime:${table}${filter ? `:${filter}` : ""}`
      const newChannel = supabase.channel(channelName)

      if (onInsert) {
        newChannel.on("postgres_changes", { event: "INSERT", schema: "public", table }, onInsert)
      }

      if (onUpdate) {
        newChannel.on("postgres_changes", { event: "UPDATE", schema: "public", table }, onUpdate)
      }

      if (onDelete) {
        newChannel.on("postgres_changes", { event: "DELETE", schema: "public", table }, onDelete)
      }

      newChannel.subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setIsConnected(true)
          setError(null)
        } else if (status === "CHANNEL_ERROR") {
          setIsConnected(false)
          setError("Failed to connect to realtime channel")
        }
      })

      setChannel(newChannel)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error")
    }
  }, [table, filter, onInsert, onUpdate, onDelete])

  const unsubscribe = useCallback(() => {
    if (channel) {
      channel.unsubscribe()
      setChannel(null)
      setIsConnected(false)
    }
  }, [channel])

  useEffect(() => {
    subscribe()
    return () => unsubscribe()
  }, [subscribe, unsubscribe])

  return {
    isConnected,
    error,
    subscribe,
    unsubscribe,
  }
}
