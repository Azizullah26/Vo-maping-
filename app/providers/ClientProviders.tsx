"use client"

import type React from "react"
import { TopNav } from "@/components/TopNav"
import { LoginAuthProvider } from "@/app/contexts/LoginAuthContext"
import AuthGuard from "@/app/components/AuthGuard"
import ErrorHandler from "@/app/components/ErrorHandler"

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <ErrorHandler />
      <LoginAuthProvider>
        <AuthGuard>
          <div className="relative">
            <TopNav />
            {children}
          </div>
        </AuthGuard>
      </LoginAuthProvider>
    </>
  )
}
