"use client"

import { useState } from "react"
import Image from "next/image"
import { Copy, Check, ChevronDown, ChevronRight } from "lucide-react"

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }}
      className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
      aria-label="Copy to clipboard"
    >
      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
    </button>
  )
}

function CodeBlock({ code, language = "json" }: { code: string; language?: string }) {
  return (
    <div className="relative group rounded-lg overflow-hidden bg-gray-950 border border-gray-800">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
        <span className="text-xs text-gray-500 font-mono">{language}</span>
        <CopyButton text={code} />
      </div>
      <pre className="p-4 text-sm text-gray-300 font-mono overflow-x-auto leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  )
}

function Section({ title, children, defaultOpen = false }: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-gray-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 bg-gray-900 hover:bg-gray-800 transition-colors text-left"
      >
        <span className="font-semibold text-white">{title}</span>
        {open ? (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-400" />
        )}
      </button>
      {open && <div className="p-5 bg-gray-950 space-y-4">{children}</div>}
    </div>
  )
}

function Badge({ color, label }: { color: string; label: string }) {
  const colors: Record<string, string> = {
    post: "bg-blue-500/20 text-blue-300 border-blue-500/40",
    get: "bg-green-500/20 text-green-300 border-green-500/40",
    required: "bg-red-500/20 text-red-300 border-red-500/40",
    optional: "bg-gray-500/20 text-gray-300 border-gray-500/40",
  }
  return (
    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${colors[color] || colors.optional}`}>
      {label}
    </span>
  )
}

const loginUrlExample = `POST https://<your-app>.vercel.app/api/sso/login-url
Content-Type: application/json

{
  "api_key": "elrace-sso-key-2024",
  "source": "hub",
  "redirect_url": "https://<your-app>.vercel.app/sso/callback"
}`

const loginUrlResponse = `{
  "success": true,
  "login_url": "https://<your-app>.vercel.app/sso/callback?token=a3f8c...",
  "token": "a3f8c9d2e1b4f7a0...",
  "expires_at": "2024-01-15T10:35:00.000Z",
  "expires_in_seconds": 300,
  "message": "Redirect the user's browser to login_url."
}`

const curlExample = `curl -X POST https://<your-app>.vercel.app/api/sso/login-url \\
  -H "Content-Type: application/json" \\
  -d '{
    "api_key": "elrace-sso-key-2024",
    "source": "hub"
  }'`

const verifyExample = `POST https://<your-app>.vercel.app/api/sso/verify
Content-Type: application/json

{
  "api_key": "elrace-sso-key-2024",
  "token": "a3f8c9d2e1b4f7a0..."
}`

const verifyResponse = `{
  "success": true,
  "session_token": "ZWxyYWNlOjE3MDU...",
  "expires_at": "2024-01-16T10:30:00.000Z",
  "user": {
    "username": "elrace",
    "role": "admin",
    "platform": "elrace-projects"
  },
  "message": "Authentication successful"
}`

const errorResponse = `{
  "success": false,
  "error": "Token has expired",
  "code": "TOKEN_EXPIRED"
}`

export default function SSODocsPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <Image src="/images/elrace-logo.png" alt="ELRACE" width={36} height={36} className="rounded" />
          <div>
            <h1 className="font-bold text-white leading-tight">ELRACE Projects — SSO API</h1>
            <p className="text-xs text-gray-400">Integration documentation for hub teams</p>
          </div>
          <div className="ml-auto">
            <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-300 border border-green-500/40">
              v1.0
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">

        {/* Overview */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-white">SSO Integration Overview</h2>
          <p className="text-gray-400 leading-relaxed">
            The ELRACE Projects platform supports Single Sign-On (SSO) via a token-based flow.
            The hub requests a one-time <code className="text-cyan-400 bg-gray-900 px-1 rounded">login_url</code> from
            our API, then redirects the user's browser to that URL. The platform handles authentication
            and redirects the user into the application automatically.
          </p>
        </div>

        {/* Base URL */}
        <div className="p-4 rounded-xl bg-gray-900 border border-gray-800 flex items-center gap-3">
          <span className="text-gray-500 text-sm font-mono">Base URL</span>
          <code className="text-cyan-400 font-mono text-sm flex-1">
            https://&lt;your-app&gt;.vercel.app
          </code>
          <CopyButton text="https://<your-app>.vercel.app" />
        </div>

        {/* Authentication flow diagram */}
        <Section title="Authentication Flow" defaultOpen>
          <div className="space-y-3">
            {[
              { step: "1", title: "Hub requests login_url", desc: "Your hub server calls POST /api/sso/login-url with the API key." },
              { step: "2", title: "Hub redirects user", desc: "Hub redirects the user's browser to the returned login_url." },
              { step: "3", title: "Platform validates token", desc: "The /sso/callback page on our platform validates the one-time token automatically." },
              { step: "4", title: "User is authenticated", desc: "On success, the user is authenticated and redirected to /welcome." },
              { step: "5", title: "(Optional) Hub verifies", desc: "Hub can call POST /api/sso/verify with the token to confirm authentication server-side." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-4 items-start">
                <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400 text-xs font-bold flex-shrink-0 mt-0.5">
                  {step}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{title}</p>
                  <p className="text-gray-400 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* API Key */}
        <Section title="API Key" defaultOpen>
          <p className="text-gray-400 text-sm">
            All hub-to-platform requests must include an <code className="text-cyan-400 bg-gray-900 px-1 rounded">api_key</code> field
            in the request body. Contact the ELRACE team to receive your production API key.
          </p>
          <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-sm">
            Keep your API key confidential. Never expose it in client-side code or public repositories.
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-900 border border-gray-800">
            <span className="text-gray-500 text-sm">Default key (development)</span>
            <code className="text-cyan-400 font-mono text-sm">elrace-sso-key-2024</code>
          </div>
        </Section>

        {/* Endpoint 1: login-url */}
        <Section title="POST /api/sso/login-url — Request a login URL" defaultOpen>
          <div className="flex items-center gap-2 mb-2">
            <Badge color="post" label="POST" />
            <code className="text-gray-300 font-mono text-sm">/api/sso/login-url</code>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            The primary endpoint. Call this from your hub backend to get a one-time
            <code className="text-cyan-400 bg-gray-900 px-1 rounded mx-1">login_url</code>
            and redirect the user to it.
          </p>

          <h4 className="text-white font-semibold text-sm mb-2">Request</h4>
          <CodeBlock code={loginUrlExample} language="http" />

          <h4 className="text-white font-semibold text-sm mt-4 mb-2">Request body parameters</h4>
          <div className="rounded-lg border border-gray-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-900">
                <tr>
                  <th className="text-left px-4 py-2 text-gray-400 font-medium">Parameter</th>
                  <th className="text-left px-4 py-2 text-gray-400 font-medium">Type</th>
                  <th className="text-left px-4 py-2 text-gray-400 font-medium">Required</th>
                  <th className="text-left px-4 py-2 text-gray-400 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {[
                  { param: "api_key", type: "string", req: "required", desc: "Your SSO API key" },
                  { param: "redirect_url", type: "string", req: "optional", desc: "Custom callback URL (defaults to /sso/callback)" },
                  { param: "source", type: "string", req: "optional", desc: "Identifier of calling system, e.g. 'hub'" },
                ].map(({ param, type, req, desc }) => (
                  <tr key={param} className="bg-gray-950">
                    <td className="px-4 py-2.5"><code className="text-cyan-400 font-mono">{param}</code></td>
                    <td className="px-4 py-2.5 text-gray-400 font-mono">{type}</td>
                    <td className="px-4 py-2.5"><Badge color={req} label={req} /></td>
                    <td className="px-4 py-2.5 text-gray-400">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h4 className="text-white font-semibold text-sm mt-4 mb-2">Success response (200)</h4>
          <CodeBlock code={loginUrlResponse} language="json" />

          <h4 className="text-white font-semibold text-sm mt-4 mb-2">cURL example</h4>
          <CodeBlock code={curlExample} language="bash" />
        </Section>

        {/* Endpoint 2: verify */}
        <Section title="POST /api/sso/verify — Verify a token (optional)">
          <div className="flex items-center gap-2 mb-2">
            <Badge color="post" label="POST" />
            <code className="text-gray-300 font-mono text-sm">/api/sso/verify</code>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Optional server-to-server endpoint. After the browser flow completes, the hub can call this
            to confirm the token was used and receive user details.
          </p>

          <h4 className="text-white font-semibold text-sm mb-2">Request</h4>
          <CodeBlock code={verifyExample} language="http" />

          <h4 className="text-white font-semibold text-sm mt-4 mb-2">Success response (200)</h4>
          <CodeBlock code={verifyResponse} language="json" />
        </Section>

        {/* Error codes */}
        <Section title="Error Codes">
          <CodeBlock code={errorResponse} language="json" />
          <div className="rounded-lg border border-gray-800 overflow-hidden mt-4">
            <table className="w-full text-sm">
              <thead className="bg-gray-900">
                <tr>
                  <th className="text-left px-4 py-2 text-gray-400 font-medium">Code</th>
                  <th className="text-left px-4 py-2 text-gray-400 font-medium">HTTP</th>
                  <th className="text-left px-4 py-2 text-gray-400 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {[
                  { code: "INVALID_API_KEY", http: "401", desc: "The api_key is missing or incorrect" },
                  { code: "MISSING_TOKEN", http: "400", desc: "No token was provided in the request" },
                  { code: "INVALID_TOKEN", http: "401", desc: "Token not found or already expired from store" },
                  { code: "TOKEN_USED", http: "401", desc: "Token was already consumed (one-time use)" },
                  { code: "TOKEN_EXPIRED", http: "401", desc: "Token was not used within 5 minutes" },
                  { code: "SERVER_ERROR", http: "500", desc: "Unexpected server error — retry" },
                ].map(({ code, http, desc }) => (
                  <tr key={code} className="bg-gray-950">
                    <td className="px-4 py-2.5"><code className="text-red-400 font-mono">{code}</code></td>
                    <td className="px-4 py-2.5 text-gray-400 font-mono">{http}</td>
                    <td className="px-4 py-2.5 text-gray-400">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Security notes */}
        <Section title="Security Notes">
          <ul className="space-y-2 text-sm text-gray-400 list-none">
            {[
              "Tokens are one-time use — they are invalidated immediately after first use.",
              "Tokens expire after 5 minutes even if unused.",
              "Always call this API from your hub server (backend), never from client-side JavaScript.",
              "The api_key should be stored as an environment variable and never committed to source control.",
              "All endpoints require HTTPS in production.",
              "CORS is enabled on /api/* routes for flexibility; API key provides the security layer.",
            ].map((note, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-cyan-500 mt-0.5">—</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Contact */}
        <div className="p-5 rounded-xl bg-gray-900 border border-gray-800 text-center">
          <p className="text-gray-400 text-sm">
            Need help with integration?
            Contact the ELRACE team to receive your production API key and endpoint URL.
          </p>
        </div>
      </main>
    </div>
  )
}
