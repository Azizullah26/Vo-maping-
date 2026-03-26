"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"

type Status = "verifying" | "success" | "error"

export default function SSOCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<Status>("verifying")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const token = searchParams.get("token")

    if (!token) {
      setStatus("error")
      setErrorMessage("No authentication token provided. Please try signing in again via the hub.")
      return
    }

    const verify = async () => {
      try {
        const res = await fetch("/api/sso/validate-callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        })

        const data = await res.json()

        if (data.success) {
          // Store auth token in localStorage (matching LoginAuthContext format)
          const expiryTime = new Date().getTime() + 24 * 60 * 60 * 1000
          localStorage.setItem("auth_token", data.session_token)
          localStorage.setItem("auth_expiry", expiryTime.toString())
          localStorage.setItem("sso_login", "true")

          console.log("[SSO] Authentication successful, redirecting to /welcome")
          setStatus("success")
          
          // Dispatch storage event to notify LoginAuthContext of the change
          window.dispatchEvent(new Event("storage"))
          
          setTimeout(() => {
            router.push("/welcome")
          }, 1500)
        } else {
          setStatus("error")
          setErrorMessage(data.error || "Authentication failed. The link may have expired.")
        }
      } catch (err) {
        console.error("[SSO] Callback error:", err)
        setStatus("error")
        setErrorMessage("A network error occurred. Please try again.")
      }
    }

    verify()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-900">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 to-blue-900/80 z-10" />
        <Image
          src="/images/uae-dubai-map-bg.png"
          alt="Background"
          fill
          className="object-cover opacity-40"
          priority
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 text-center max-w-sm px-6">
        {/* Logo */}
        <Image
          src="/images/elrace-logo.png"
          alt="ELRACE Logo"
          width={80}
          height={80}
          className="rounded-lg shadow-lg shadow-cyan-500/20"
        />

        {status === "verifying" && (
          <>
            {/* Spinner */}
            <div className="w-14 h-14 rounded-full border-4 border-cyan-500/30 border-t-cyan-500 animate-spin" />
            <div>
              <h1 className="text-xl font-semibold text-white mb-1">Signing you in</h1>
              <p className="text-gray-400 text-sm">Verifying your SSO credentials...</p>
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-14 h-14 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
              <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white mb-1">Authentication successful</h1>
              <p className="text-gray-400 text-sm">Redirecting you to the platform...</p>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-14 h-14 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center">
              <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white mb-1">Authentication failed</h1>
              <p className="text-gray-400 text-sm mb-4">{errorMessage}</p>
              <button
                onClick={() => router.push("/login")}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Back to login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-900">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 to-blue-900/80 z-10" />
        <Image
          src="/images/uae-dubai-map-bg.png"
          alt="Background"
          fill
          className="object-cover opacity-40"
          priority
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 text-center max-w-sm px-6">
        {/* Logo */}
        <Image
          src="/images/elrace-logo.png"
          alt="ELRACE Logo"
          width={80}
          height={80}
          className="rounded-lg shadow-lg shadow-cyan-500/20"
        />

        {status === "verifying" && (
          <>
            {/* Spinner */}
            <div className="w-14 h-14 rounded-full border-4 border-cyan-500/30 border-t-cyan-500 animate-spin" />
            <div>
              <h1 className="text-xl font-semibold text-white mb-1">Signing you in</h1>
              <p className="text-gray-400 text-sm">Verifying your SSO credentials...</p>
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-14 h-14 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
              <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white mb-1">Authentication successful</h1>
              <p className="text-gray-400 text-sm">Redirecting you to the platform...</p>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-14 h-14 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center">
              <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white mb-1">Authentication failed</h1>
              <p className="text-gray-400 text-sm mb-4">{errorMessage}</p>
              <button
                onClick={() => router.push("/login")}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Back to login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
