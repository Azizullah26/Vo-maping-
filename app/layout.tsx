import "./globals.css"
import { Inter } from "next/font/google"
import type React from "react"
import { TopNav } from "@/components/TopNav"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "UAE Interactive Map",
  description: "Explore UAE with an interactive map featuring projects and developments",
    generator: 'v0.app'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link href="https://api.mapbox.com/mapbox-gl-js/v3.1.2/mapbox-gl.css" rel="stylesheet" />
        <link href="https://unpkg.com/mapillary-js@4.1.2/dist/mapillary.css" rel="stylesheet" />
      </head>
      <body className={`${inter.className} h-full m-0 p-0`}>
        <div className="relative">
          <TopNav />
          {children}
        </div>
        <Script src="https://api.mapbox.com/mapbox-gl-js/v3.1.2/mapbox-gl.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
