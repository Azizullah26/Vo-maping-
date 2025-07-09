"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { User, Session } from "@supabase/supabase-js"

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null
}

export function useSupabaseAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          setState((prev) => ({ ...prev, error: error.message, loading: false }))
          return
        }

        setState((prev) => ({
          ...prev,
          session,
          user: session?.user ?? null,
          loading: false,
        }))
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : "Failed to get session",
          loading: false,
        }))
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session)

      setState((prev) => ({
        ...prev,
        session,
        user: session?.user ?? null,
        loading: false,
        error: null,
      }))
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setState((prev) => ({ ...prev, error: error.message, loading: false }))
        return { success: false, error: error.message }
      }

      setState((prev) => ({
        ...prev,
        session: data.session,
        user: data.user,
        loading: false,
      }))

      return { success: true, data }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Sign in failed"
      setState((prev) => ({ ...prev, error: errorMessage, loading: false }))
      return { success: false, error: errorMessage }
    }
  }

  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      })

      if (error) {
        setState((prev) => ({ ...prev, error: error.message, loading: false }))
        return { success: false, error: error.message }
      }

      setState((prev) => ({
        ...prev,
        session: data.session,
        user: data.user,
        loading: false,
      }))

      return { success: true, data }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Sign up failed"
      setState((prev) => ({ ...prev, error: errorMessage, loading: false }))
      return { success: false, error: errorMessage }
    }
  }

  const signOut = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      const { error } = await supabase.auth.signOut()

      if (error) {
        setState((prev) => ({ ...prev, error: error.message, loading: false }))
        return { success: false, error: error.message }
      }

      setState((prev) => ({
        ...prev,
        session: null,
        user: null,
        loading: false,
      }))

      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Sign out failed"
      setState((prev) => ({ ...prev, error: errorMessage, loading: false }))
      return { success: false, error: errorMessage }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Password reset failed",
      }
    }
  }

  const updateProfile = async (updates: Record<string, any>) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      const { data, error } = await supabase.auth.updateUser({
        data: updates,
      })

      if (error) {
        setState((prev) => ({ ...prev, error: error.message, loading: false }))
        return { success: false, error: error.message }
      }

      setState((prev) => ({
        ...prev,
        user: data.user,
        loading: false,
      }))

      return { success: true, data }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Profile update failed"
      setState((prev) => ({ ...prev, error: errorMessage, loading: false }))
      return { success: false, error: errorMessage }
    }
  }

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    isAuthenticated: !!state.user,
  }
}
