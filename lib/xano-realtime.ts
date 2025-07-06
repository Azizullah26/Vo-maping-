"use client"

import { xanoConfig } from "./xano-config"

class XanoRealtime {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private listeners: Map<string, Set<Function>> = new Map()

  connect(authToken?: string) {
    try {
      const wsUrl = `${xanoConfig.baseURL.replace("http", "ws")}/ws`
      const url = authToken ? `${wsUrl}?token=${authToken}` : wsUrl

      this.ws = new WebSocket(url)

      this.ws.onopen = () => {
        console.log("Xano WebSocket connected")
        this.reconnectAttempts = 0
      }

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          this.handleMessage(data)
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error)
        }
      }

      this.ws.onclose = () => {
        console.log("Xano WebSocket disconnected")
        this.attemptReconnect(authToken)
      }

      this.ws.onerror = (error) => {
        console.error("Xano WebSocket error:", error)
      }
    } catch (error) {
      console.error("Failed to connect to Xano WebSocket:", error)
    }
  }

  private attemptReconnect(authToken?: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      setTimeout(() => {
        console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
        this.connect(authToken)
      }, this.reconnectDelay * this.reconnectAttempts)
    }
  }

  private handleMessage(data: any) {
    const { type, payload } = data
    const listeners = this.listeners.get(type)

    if (listeners) {
      listeners.forEach((callback) => callback(payload))
    }
  }

  subscribe(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(callback)

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(event)
      if (listeners) {
        listeners.delete(callback)
        if (listeners.size === 0) {
          this.listeners.delete(event)
        }
      }
    }
  }

  send(type: string, payload: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }))
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.listeners.clear()
  }
}

export const xanoRealtime = new XanoRealtime()
