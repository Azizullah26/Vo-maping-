import "./globals.css"
import "./responsive.css"
import { Inter } from "next/font/google"
import type React from "react"
import { TopNav } from "@/components/TopNav"
import Script from "next/script"
import { LoginAuthProvider } from "@/app/contexts/LoginAuthContext"
import AuthGuard from "@/app/components/AuthGuard"
import ErrorHandler from "@/app/components/ErrorHandler"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "EL RACE Projects – Building Tomorrow's Infrastructure Today",
  description:
    "ELRACE Projects is a leading provider of innovative construction and infrastructure solutions across the UAE. From design to delivery, we ensure excellence in every project.",
  openGraph: {
    title: "ELRACE Projects – Building Tomorrow's Infrastructure Today",
    description:
      "ELRACE Projects is a leading provider of innovative construction and infrastructure solutions across the UAE. From design to delivery, we ensure excellence in every project.",
    images: [
      {
        url: "/abu-dhabi-police-logo.png",
        width: 1200,
        height: 630,
        alt: "ELRACE Projects Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ELRACE Projects – Building Tomorrow's Infrastructure Today",
    description:
      "ELRACE Projects is a leading provider of innovative construction and infrastructure solutions across the UAE. From design to delivery, we ensure excellence in every project.",
    images: ["/abu-dhabi-police-logo.png"],
    creator: "@elraceprojects",
  },
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link href="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css" rel="stylesheet" />
        <link href="https://unpkg.com/mapillary-js@4.1.2/dist/mapillary.css" rel="stylesheet" />

        {/* WhatsApp specific meta tags */}
        <meta property="og:title" content="ELRACE Projects – Building Tomorrow's Infrastructure Today" />
        <meta
          property="og:description"
          content="ELRACE Projects is a leading provider of innovative construction and infrastructure solutions across the UAE. From design to delivery, we ensure excellence in every project."
        />
        <meta property="og:image" content="/abu-dhabi-police-logo.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="ELRACE Projects" />
        <meta property="og:type" content="website" />
      </head>
      <body className={`${inter.className} h-full m-0 p-0`}>
        <ErrorHandler />
        <LoginAuthProvider>
          <AuthGuard>
            <div className="relative">
              <TopNav />
              {children}
            </div>
          </AuthGuard>
        </LoginAuthProvider>
        <Script src="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
