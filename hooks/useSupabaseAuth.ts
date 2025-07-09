"use client"

import { useState, useEffect } from "react"
import { type User, type Session, AuthError } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

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

        if (error) throw error

        setState({
          user: session?.user ?? null,
          session,
          loading: false,
          error: null,
        })
      } catch (error) {
        setState({
          user: null,
          session: null,
          loading: false,
          error: error instanceof Error ? error.message : "Failed to get session",
        })
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setState({
        user: session?.user ?? null,
        session,
        loading: false,
        error: null,
      })
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      const errorMessage = error instanceof AuthError ? error.message : "Sign in failed"
      setState((prev) => ({ ...prev, loading: false, error: errorMessage }))
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

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      const errorMessage = error instanceof AuthError ? error.message : "Sign up failed"
      setState((prev) => ({ ...prev, loading: false, error: errorMessage }))
      return { success: false, error: errorMessage }
    }
  }

  const signOut = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      const { error } = await supabase.auth.signOut()

      if (error) throw error

      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof AuthError ? error.message : "Sign out failed"
      setState((prev) => ({ ...prev, loading: false, error: errorMessage }))
      return { success: false, error: errorMessage }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)

      if (error) throw error

      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof AuthError ? error.message : "Password reset failed"
      return { success: false, error: errorMessage }
    }
  }

  const updateProfile = async (updates: Record<string, any>) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: updates,
      })

      if (error) throw error

      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof AuthError ? error.message : "Profile update failed"
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
  }
}
