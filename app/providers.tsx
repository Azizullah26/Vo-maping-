"use client"

import type React from "react"
import { LoginAuthProvider } from "@/app/contexts/LoginAuthContext"
import AuthGuard from "@/app/components/AuthGuard"
import ErrorHandler from "@/app/components/ErrorHandler"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LoginAuthProvider>
      <AuthGuard>
        <ErrorHandler>
          {children}
        </ErrorHandler>
      </AuthGuard>
    </LoginAuthProvider>
  )
}
