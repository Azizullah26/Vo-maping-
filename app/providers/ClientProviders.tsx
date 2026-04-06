"use client"

import type React from "react"
import { TopNav } from "@/components/TopNav"
import { LoginAuthProvider } from "@/app/contexts/LoginAuthContext"
import AuthGuard from "@/app/components/AuthGuard"
import ErrorHandler from "@/app/components/ErrorHandler"
import { SSORedirectHandler } from "@/components/SSORedirectHandler"

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <ErrorHandler />
      <SSORedirectHandler />
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
