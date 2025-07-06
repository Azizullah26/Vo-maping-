"use client"

import { useEffect, useRef } from "react"
import { xanoRealtime } from "@/lib/xano-realtime"
import { useXanoAuth } from "./useXanoAuth"

export function useXanoRealtime() {
  const { user } = useXanoAuth()
  const connectedRef = useRef(false)

  useEffect(() => {
    if (user && !connectedRef.current) {
      // Connect with auth token
      const authToken = localStorage.getItem("xano_auth_token")
      xanoRealtime.connect(authToken || undefined)
      connectedRef.current = true
    }

    return () => {
      if (connectedRef.current) {
        xanoRealtime.disconnect()
        connectedRef.current = false
      }
    }
  }, [user])

  return {
    subscribe: xanoRealtime.subscribe.bind(xanoRealtime),
    send: xanoRealtime.send.bind(xanoRealtime),
  }
}

// Hook for document updates
export function useDocumentUpdates(projectId?: string) {
  const { subscribe } = useXanoRealtime()

  useEffect(() => {
    const unsubscribe = subscribe("document_updated", (data: any) => {
      if (!projectId || data.project_id === projectId) {
        // Handle document update
        window.dispatchEvent(new CustomEvent("documentUpdate", { detail: data }))
      }
    })

    return unsubscribe
  }, [projectId, subscribe])
}

// Hook for project updates
export function useProjectUpdates() {
  const { subscribe } = useXanoRealtime()

  useEffect(() => {
    const unsubscribe = subscribe("project_updated", (data: any) => {
      // Handle project update
      window.dispatchEvent(new CustomEvent("projectUpdate", { detail: data }))
    })

    return unsubscribe
  }, [subscribe])
}
