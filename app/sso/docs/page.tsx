"use client"

import { useState } from "react"
import { Copy, Check, ChevronDown, ChevronRight, Shield, Zap, Key, ArrowRight } from "lucide-react"

const BASE_URL = "https://elracemap.vercel.app"

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }}
      className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
      aria-label="Copy to clipboard"
    >
      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
    </button>
  )
}

function CodeBlock({ code, language = "json" }: { code: string; language?: string }) {
  return (
    <div className="relative rounded-lg overflow-hidden bg-[#0a0e1a] border border-slate-800">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-slate-800">
        <span className="text-xs text-slate-500 font-mono uppercase tracking-wide">{language}</span>
        <CopyButton text={code} />
      </div>
      <pre className="p-4 text-sm text-slate-300 font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap">
        <code>{code}</code>
      </pre>
    </div>
  )
}

function Section({
  title,
  children,
  defaultOpen = false,
  tag,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  tag?: string
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-slate-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 bg-slate-900/60 hover:bg-slate-900 transition-colors text-left gap-3"
      >
        <div className="flex items-center gap-3">
          <span className="font-semibold text-white">{title}</span>
          {tag && (
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              {tag}
            </span>
          )}
        </div>
        {open ? (
          <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
        )}
      </button>
      {open && <div className="p-6 bg-[#070b16] space-y-5 border-t border-slate-800">{children}</div>}
    </div>
  )
}

function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    POST: "bg-blue-500/15 text-blue-300 border-blue-500/40",
    GET: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
  }
  return (
    <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded border ${colors[method] || ""}`}>
      {method}
    </span>
  )
}

function RequiredBadge({ required }: { required: boolean }) {
  return required ? (
    <span className="text-xs px-2 py-0.5 rounded bg-red-500/15 text-red-400 border border-red-500/30 font-mono">required</span>
  ) : (
    <span className="text-xs px-2 py-0.5 rounded bg-slate-700/40 text-slate-400 border border-slate-700 font-mono">optional</span>
  )
}

// ─── Code samples ────────────────────────────────────────────────────────────

const loginUrlRequest = `POST ${BASE_URL}/api/sso/login-url
Content-Type: application/json

{
  "api_key": "<YOUR_SSO_API_KEY>",
  "source": "hub"
}`

const loginUrlResponse = `HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "login_url": "${BASE_URL}/sso/callback?token=a3f8c9d2e1b4f7a069...",
  "token": "a3f8c9d2e1b4f7a069c3e2d5f8b1a4e7...",
  "expires_at": "2025-01-15T10:35:00.000Z",
  "expires_in_seconds": 300,
  "message": "Redirect the user's browser to login_url."
}`

const curlExample = `curl -X POST ${BASE_URL}/api/sso/login-url \\
  -H "Content-Type: application/json" \\
  -d '{
    "api_key": "<YOUR_SSO_API_KEY>",
    "source": "hub"
  }'`

const nodejsExample = `// Node.js / hub backend example
const response = await fetch("${BASE_URL}/api/sso/login-url", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    api_key: process.env.ELRACE_SSO_API_KEY,
    source: "hub",
  }),
});

const { success, login_url } = await response.json();

if (success) {
  // Redirect the user's browser to login_url
  res.redirect(login_url);
}`

const pythonExample = `import requests, os

resp = requests.post(
    "${BASE_URL}/api/sso/login-url",
    json={
        "api_key": os.environ["ELRACE_SSO_API_KEY"],
        "source": "hub",
    },
)

data = resp.json()
if data["success"]:
    # Redirect the user browser to data["login_url"]
    redirect(data["login_url"])`

const verifyRequest = `POST ${BASE_URL}/api/sso/verify
Content-Type: application/json

{
  "api_key": "<YOUR_SSO_API_KEY>",
  "token": "a3f8c9d2e1b4f7a069c3e2d5f8b1a4e7..."
}`

const verifyResponse = `HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "session_token": "ZWxyYWNlOjE3MDUzMjE4MDAwMDA...",
  "expires_at": "2025-01-16T10:30:00.000Z",
  "user": {
    "username": "elrace",
    "role": "admin",
    "platform": "elrace-projects",
    "source": "hub"
  },
  "message": "Authentication successful"
}`

const errorExample = `HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "success": false,
  "error": "Token has expired",
  "code": "TOKEN_EXPIRED"
}`

// ─── Component ────────────────────────────────────────────────────────────────

export default function SSODocsPage() {
  return (
    <div className="min-h-screen bg-[#070b16] text-white font-sans">

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
            <Shield className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="font-bold text-white leading-tight text-sm">ELRACE Projects Platform</h1>
            <p className="text-xs text-slate-400">SSO Integration API — Hub Team Documentation</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono">
              v1.0 · Live
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-10">

        {/* Hero */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 text-xs text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-full font-mono">
            <Zap className="w-3 h-3" />
            Single Sign-On API Documentation
          </div>
          <h2 className="text-3xl font-bold text-white leading-tight">
            ELRACE SSO Integration Guide
          </h2>
          <p className="text-slate-400 leading-relaxed max-w-2xl">
            This document describes how the hub platform can integrate SSO authentication with the
            ELRACE Projects platform. The hub requests a one-time{" "}
            <code className="text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded text-sm">login_url</code>,
            then redirects the user's browser — the platform handles all authentication automatically.
          </p>
        </div>

        {/* Production Base URL */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700 flex flex-wrap items-center gap-3">
          <span className="text-slate-500 text-sm font-mono">Production URL</span>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <code className="text-cyan-400 font-mono text-sm bg-slate-950 px-3 py-1.5 rounded border border-slate-800 truncate">
              {BASE_URL}
            </code>
            <CopyButton text={BASE_URL} />
          </div>
          <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-mono flex-shrink-0">
            HTTPS only
          </span>
        </div>

        {/* Key info cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: <Key className="w-4 h-4" />, label: "Auth Method", value: "API Key (request body)" },
            { icon: <Zap className="w-4 h-4" />, label: "Token Lifetime", value: "5 minutes, one-time use" },
            { icon: <Shield className="w-4 h-4" />, label: "Transport", value: "HTTPS required" },
          ].map(({ icon, label, value }) => (
            <div key={label} className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex items-start gap-3">
              <div className="text-cyan-400 mt-0.5 flex-shrink-0">{icon}</div>
              <div>
                <p className="text-slate-500 text-xs">{label}</p>
                <p className="text-white text-sm font-medium">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Authentication flow */}
        <Section title="Authentication Flow — Step by Step" defaultOpen>
          <div className="space-y-3">
            {[
              {
                step: "1",
                title: "Hub backend requests a login_url",
                desc: `Your hub server sends a POST request to ${BASE_URL}/api/sso/login-url with your API key. Never do this from client-side code.`,
                code: true,
              },
              {
                step: "2",
                title: "Hub receives login_url and redirects user",
                desc: "The API returns a login_url containing a one-time token. Your hub redirects the user's browser (HTTP 302) to this URL.",
                code: false,
              },
              {
                step: "3",
                title: "Platform validates token automatically",
                desc: `The user lands on ${BASE_URL}/sso/callback. The platform validates the token, creates a session, and logs the user in.`,
                code: false,
              },
              {
                step: "4",
                title: "User is redirected into the platform",
                desc: "On success the user is redirected to /welcome inside the ELRACE platform, fully authenticated.",
                code: false,
              },
              {
                step: "5",
                title: "(Optional) Hub verifies server-side",
                desc: `The hub can call POST ${BASE_URL}/api/sso/verify with the token to confirm authentication and retrieve user/session details.`,
                code: false,
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-4 items-start p-4 rounded-lg bg-slate-900/40 border border-slate-800">
                <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400 text-xs font-bold flex-shrink-0 mt-0.5">
                  {step}
                </div>
                <div>
                  <p className="text-white font-medium text-sm mb-0.5">{title}</p>
                  <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Visual flow */}
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-mono">
            {["Hub Server", "POST /api/sso/login-url", "login_url", "User Browser", "/sso/callback", "Authenticated"].map((item, i, arr) => (
              <>
                <span key={`item-${i}`} className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">{item}</span>
                {i < arr.length - 1 && <ArrowRight key={`arrow-${i}`} className="w-3 h-3 text-slate-600" />}
              </>
            ))}
          </div>
        </Section>

        {/* API Key */}
        <Section title="API Key Configuration" defaultOpen tag="Required">
          <p className="text-slate-400 text-sm leading-relaxed">
            All requests from the hub to the ELRACE platform must include an{" "}
            <code className="text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded">api_key</code> field
            in the JSON request body. The hub team will receive the production API key directly from the
            ELRACE team via a secure channel.
          </p>
          <div className="p-4 rounded-lg bg-amber-500/8 border border-amber-500/25 text-amber-300 text-sm leading-relaxed">
            <strong className="text-amber-200">Security notice:</strong> Store the API key as a server-side
            environment variable (e.g. <code className="font-mono text-amber-200">ELRACE_SSO_API_KEY</code>).
            Never expose it in client-side JavaScript, browser console, or public repositories.
          </div>
          <div className="flex flex-wrap items-center gap-3 p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-sm">
            <span className="text-slate-500">Platform env var name:</span>
            <code className="text-cyan-400">SSO_API_KEY</code>
            <span className="text-slate-600">|</span>
            <span className="text-slate-500">Hub env var (suggested):</span>
            <code className="text-cyan-400">ELRACE_SSO_API_KEY</code>
          </div>
        </Section>

        {/* Endpoint 1 */}
        <Section title="Endpoint 1 — Request Login URL" defaultOpen tag="Primary">
          <div className="flex flex-wrap items-center gap-3">
            <MethodBadge method="POST" />
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <code className="text-slate-200 font-mono text-sm bg-slate-900 px-3 py-1.5 rounded border border-slate-800 truncate">
                {BASE_URL}/api/sso/login-url
              </code>
              <CopyButton text={`${BASE_URL}/api/sso/login-url`} />
            </div>
          </div>

          <p className="text-slate-400 text-sm">
            Call this from your hub backend to receive a one-time <code className="text-cyan-400 bg-slate-900 px-1 rounded">login_url</code>.
            Redirect the user's browser to that URL immediately — it expires in 5 minutes.
          </p>

          <h4 className="text-white font-semibold text-sm">Request</h4>
          <CodeBlock code={loginUrlRequest} language="http" />

          <h4 className="text-white font-semibold text-sm">Request Body Parameters</h4>
          <div className="rounded-lg border border-slate-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-900">
                <tr>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">Parameter</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">Type</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">Status</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {[
                  { param: "api_key", type: "string", req: true, desc: "Your SSO API key issued by ELRACE" },
                  { param: "source", type: "string", req: false, desc: "Identifier of your hub system, e.g. 'hub' or 'portal'" },
                  { param: "redirect_url", type: "string", req: false, desc: `Custom callback base URL — defaults to ${BASE_URL}/sso/callback` },
                ].map(({ param, type, req, desc }) => (
                  <tr key={param} className="bg-[#070b16]">
                    <td className="px-4 py-3"><code className="text-cyan-400 font-mono">{param}</code></td>
                    <td className="px-4 py-3 text-slate-400 font-mono">{type}</td>
                    <td className="px-4 py-3"><RequiredBadge required={req} /></td>
                    <td className="px-4 py-3 text-slate-400">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h4 className="text-white font-semibold text-sm">Success Response (200)</h4>
          <CodeBlock code={loginUrlResponse} language="http" />

          <h4 className="text-white font-semibold text-sm">Response Fields</h4>
          <div className="rounded-lg border border-slate-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-900">
                <tr>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">Field</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">Type</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {[
                  { field: "success", type: "boolean", desc: "Always true on success" },
                  { field: "login_url", type: "string", desc: "Redirect the user browser to this URL immediately" },
                  { field: "token", type: "string", desc: "The raw token (also embedded in login_url). One-time use." },
                  { field: "expires_at", type: "string (ISO 8601)", desc: "Token expiry timestamp (5 min from now)" },
                  { field: "expires_in_seconds", type: "number", desc: "Always 300 (5 minutes)" },
                  { field: "message", type: "string", desc: "Human-readable instruction" },
                ].map(({ field, type, desc }) => (
                  <tr key={field} className="bg-[#070b16]">
                    <td className="px-4 py-3"><code className="text-cyan-400 font-mono">{field}</code></td>
                    <td className="px-4 py-3 text-slate-400 font-mono text-xs">{type}</td>
                    <td className="px-4 py-3 text-slate-400">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h4 className="text-white font-semibold text-sm">cURL Example</h4>
          <CodeBlock code={curlExample} language="bash" />

          <h4 className="text-white font-semibold text-sm">Node.js Example</h4>
          <CodeBlock code={nodejsExample} language="javascript" />

          <h4 className="text-white font-semibold text-sm">Python Example</h4>
          <CodeBlock code={pythonExample} language="python" />
        </Section>

        {/* Endpoint 2 */}
        <Section title="Endpoint 2 — Verify Token (Optional, Server-Side)" tag="Optional">
          <div className="flex flex-wrap items-center gap-3">
            <MethodBadge method="POST" />
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <code className="text-slate-200 font-mono text-sm bg-slate-900 px-3 py-1.5 rounded border border-slate-800 truncate">
                {BASE_URL}/api/sso/verify
              </code>
              <CopyButton text={`${BASE_URL}/api/sso/verify`} />
            </div>
          </div>

          <p className="text-slate-400 text-sm leading-relaxed">
            This is an optional hub-to-platform server-side call. After the user's browser completes the
            callback flow, the hub backend can call this endpoint with the same token to confirm
            authentication succeeded and receive user session details. Note: a token can only be
            consumed once — either by the browser callback or by this endpoint, not both.
          </p>

          <h4 className="text-white font-semibold text-sm">Request</h4>
          <CodeBlock code={verifyRequest} language="http" />

          <h4 className="text-white font-semibold text-sm">Success Response (200)</h4>
          <CodeBlock code={verifyResponse} language="http" />
        </Section>

        {/* Error Codes */}
        <Section title="Error Codes Reference">
          <CodeBlock code={errorExample} language="http" />
          <div className="rounded-lg border border-slate-800 overflow-hidden mt-2">
            <table className="w-full text-sm">
              <thead className="bg-slate-900">
                <tr>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">Error Code</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">HTTP</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">Description</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">Resolution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {[
                  { code: "INVALID_API_KEY", http: "401", desc: "api_key is missing or incorrect", fix: "Check the api_key value matches the one issued by ELRACE" },
                  { code: "MISSING_TOKEN", http: "400", desc: "No token provided", fix: "Include token in the request body" },
                  { code: "INVALID_TOKEN", http: "401", desc: "Token not found — never existed or expired from store", fix: "Request a new login_url" },
                  { code: "TOKEN_USED", http: "401", desc: "Token already consumed (one-time use)", fix: "Request a new login_url — do not reuse tokens" },
                  { code: "TOKEN_EXPIRED", http: "401", desc: "Token was not used within 5 minutes", fix: "Request a fresh login_url and redirect user promptly" },
                  { code: "SERVER_ERROR", http: "500", desc: "Unexpected platform error", fix: "Retry the request — contact ELRACE if persistent" },
                ].map(({ code, http, desc, fix }) => (
                  <tr key={code} className="bg-[#070b16]">
                    <td className="px-4 py-3"><code className="text-red-400 font-mono text-xs">{code}</code></td>
                    <td className="px-4 py-3 text-slate-400 font-mono">{http}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{desc}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{fix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Security */}
        <Section title="Security Requirements">
          <ul className="space-y-3">
            {[
              { title: "Server-side only", desc: "Always call /api/sso/login-url from your hub backend. Never from client-side JavaScript or the browser." },
              { title: "One-time tokens", desc: "Each token is invalidated immediately on first use. Do not attempt to reuse tokens." },
              { title: "5-minute expiry", desc: "Tokens expire 5 minutes after generation regardless of use. Redirect users promptly after receiving login_url." },
              { title: "HTTPS only", desc: "All API calls must use HTTPS. HTTP requests will be rejected or redirected." },
              { title: "API key storage", desc: "Store the API key in a server-side environment variable. Never commit it to source control or expose it to the browser." },
              { title: "No custom redirect_url in production", desc: "If using the redirect_url parameter, ensure it points to a domain you control. The default /sso/callback is recommended." },
            ].map(({ title, desc }) => (
              <li key={title} className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/40 border border-slate-800">
                <span className="text-cyan-500 font-bold text-sm mt-0.5 flex-shrink-0">—</span>
                <div>
                  <span className="text-white font-medium text-sm">{title}: </span>
                  <span className="text-slate-400 text-sm">{desc}</span>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        {/* Quick Reference */}
        <Section title="Quick Reference Card" defaultOpen>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-sm">
            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
              <p className="text-slate-500 text-xs uppercase tracking-wide mb-3">Endpoints</p>
              <div className="flex items-start gap-2">
                <span className="text-blue-400">POST</span>
                <code className="text-slate-300 text-xs">/api/sso/login-url</code>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-400">POST</span>
                <code className="text-slate-300 text-xs">/api/sso/verify</code>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-slate-500">GET</span>
                <code className="text-slate-300 text-xs">/sso/callback</code>
                <span className="text-slate-600 text-xs">(browser)</span>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
              <p className="text-slate-500 text-xs uppercase tracking-wide mb-3">Key Facts</p>
              <p className="text-slate-400 text-xs">Token TTL: <span className="text-white">5 minutes</span></p>
              <p className="text-slate-400 text-xs">Token reuse: <span className="text-red-400">Not allowed (one-time)</span></p>
              <p className="text-slate-400 text-xs">Auth type: <span className="text-white">API key in request body</span></p>
              <p className="text-slate-400 text-xs">Callback page: <span className="text-cyan-400">/sso/callback</span></p>
              <p className="text-slate-400 text-xs">After login: <span className="text-white">Redirected to /welcome</span></p>
            </div>
          </div>
        </Section>

        {/* Contact */}
        <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-700 text-center space-y-3">
          <p className="text-white font-semibold">Need help with your integration?</p>
          <p className="text-slate-400 text-sm">
            Contact the ELRACE platform team to receive your production{" "}
            <code className="text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded">SSO_API_KEY</code>{" "}
            and for any technical support during integration.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-slate-500">
            <span>Platform:</span>
            <a href={BASE_URL} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">{BASE_URL}</a>
            <span>·</span>
            <span>Docs:</span>
            <a href={`${BASE_URL}/sso/docs`} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">{BASE_URL}/sso/docs</a>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-slate-600 text-xs pb-4">
          ELRACE Projects Platform — SSO API v1.0 — Confidential, for hub team use only
        </footer>

      </main>
    </div>
  )
}
