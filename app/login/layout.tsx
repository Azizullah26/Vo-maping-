"use client"

import { AuthProvider } from "@/app/contexts/AuthContext"
import type React from "react"

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
