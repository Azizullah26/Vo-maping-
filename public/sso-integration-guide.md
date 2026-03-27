# ELRACE Map Platform — SSO Integration Guide

**Platform URL:** https://elracemap.vercel.app  
**Document Version:** 1.0  
**Date:** March 2026  
**Prepared for:** Hub Integration Team  

---

## Overview

This document describes how to integrate Single Sign-On (SSO) with the ELRACE Map Platform. The hub authenticates the user on its side and then calls the ELRACE API to generate a one-time login URL. The user is redirected to that URL and automatically signed into the platform without needing to enter a password. After successful SSO authentication, users are directly redirected to the welcome page and have immediate access to the platform with no intermediate login page shown.

---

## Authentication Flow

**Direct Welcome Page Access:** After successful SSO authentication, users are automatically redirected to the welcome page and have immediate access to the platform. No login page is displayed to users who have already been authenticated via SSO.

\`\`\`
1. Hub backend calls POST /api/sso/login-url with api_key
2. ELRACE returns { login_url, token, expires_in }
3. Hub redirects the user's browser to login_url
4. User lands on /sso/callback on the ELRACE platform
5. Platform validates the token, creates a session, redirects to /welcome
6. User has immediate access to the platform (no login page shown)
7. (Optional) Hub backend calls POST /api/sso/verify to confirm session details
\`\`\`

**Sequence Diagram:**

\`\`\`
Hub Server          User Browser         ELRACE Platform
    |                    |                      |
    |-- POST /api/sso/login-url (api_key) ------>|
    |<-- { login_url, token } ------------------|
    |                    |                      |
    |-- HTTP 302 ------->|                      |
    |  Location: login_url                      |
    |                    |-- GET /sso/callback?token=... -->|
    |                    |                      |-- validate token
    |                    |                      |-- create session
    |                    |<-- redirect to /welcome --------|
    |                    |-- GET /welcome -->|
    |                    |<-- welcome page (authenticated) ---|
    |                    |                      |
    | (optional server check)                   |
    |-- POST /api/sso/verify (token, api_key) -->|
    |<-- { session_token, user } ---------------|
\`\`\`

---

## Base URL

\`\`\`
https://elracemap.vercel.app
\`\`\`

---

## Authentication

All API requests must include the `api_key` field in the request body. This key is shared securely by the ELRACE team.

\`\`\`json
{
  "api_key": "rcc0085_map_security"
}
\`\`\`

Store the API key securely as an environment variable on your server. Never expose it in client-side code.

---

## Endpoints

---

### 1. Generate Login URL

**Endpoint:**
\`\`\`
POST https://elracemap.vercel.app/api/sso/login-url
\`\`\`

**Description:**  
Call this from your hub backend. Returns a one-time `login_url` that you redirect the user's browser to. The token embedded in the URL expires in **5 minutes** and is **single-use only**.

**Request Headers:**
\`\`\`
Content-Type: application/json
\`\`\`

**Request Body:**
\`\`\`json
{
  "api_key": "rcc0085_map_security",
  "source": "hub",
  "redirect_url": "https://elracemap.vercel.app/sso/callback"
}
\`\`\`

| Field | Type | Required | Description |
|---|---|---|---|
| `api_key` | string | Yes | Shared API key provided by ELRACE team |
| `source` | string | No | Identifier for your hub (default: `"hub"`) |
| `redirect_url` | string | No | Override the callback URL (default: platform callback) |

**Success Response — 200 OK:**
\`\`\`json
{
  "success": true,
  "login_url": "https://elracemap.vercel.app/sso/callback?token=abc123xyz&source=hub",
  "token": "abc123xyz",
  "expires_in": 300,
  "expires_at": "2026-03-11T12:05:00.000Z",
  "instructions": "Redirect the user's browser to login_url within 5 minutes."
}
\`\`\`

| Field | Description |
|---|---|
| `login_url` | Full URL to redirect the user's browser to |
| `token` | The raw one-time token (also embedded in login_url) |
| `expires_in` | Seconds until the token expires (always 300) |
| `expires_at` | ISO 8601 timestamp when the token expires |

**Error Responses:**

\`\`\`json
// 401 — Invalid API key
{ "success": false, "error": "Invalid or missing API key", "code": "INVALID_API_KEY" }

// 500 — Server error
{ "success": false, "error": "Internal server error", "code": "SERVER_ERROR" }
\`\`\`

**Example — Node.js / JavaScript:**
\`\`\`js
const response = await fetch("https://elracemap.vercel.app/api/sso/login-url", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    api_key: process.env.ELRACE_SSO_API_KEY,
    source: "hub",
  }),
})

const data = await response.json()

if (data.success) {
  // Redirect the user's browser
  res.redirect(302, data.login_url)
} else {
  console.error("SSO Error:", data.error)
}
\`\`\`

**Example — Python:**
\`\`\`python
import requests
import os

response = requests.post(
    "https://elracemap.vercel.app/api/sso/login-url",
    json={
        "api_key": os.environ["ELRACE_SSO_API_KEY"],
        "source": "hub",
    }
)

data = response.json()

if data["success"]:
    # Redirect user to data["login_url"]
    print(data["login_url"])
else:
    print("Error:", data["error"])
\`\`\`

**Example — PHP:**
\`\`\`php
$response = file_get_contents("https://elracemap.vercel.app/api/sso/login-url", false,
    stream_context_create([
        "http" => [
            "method"  => "POST",
            "header"  => "Content-Type: application/json",
            "content" => json_encode([
                "api_key" => getenv("ELRACE_SSO_API_KEY"),
                "source"  => "hub",
            ])
        ]
    ])
);

$data = json_decode($response, true);

if ($data["success"]) {
    header("Location: " . $data["login_url"]);
    exit;
}
\`\`\`

---

### 2. Verify Token (Optional)

**Endpoint:**
\`\`\`
POST https://elracemap.vercel.app/api/sso/verify
\`\`\`

**Description:**  
Optional server-to-server call from your hub backend to verify a token was valid and retrieve session details. Useful for audit logging or confirming authentication before granting access to hub resources. Note: consuming a token via `/verify` also prevents it from being used at `/sso/callback`.

**Request Headers:**
\`\`\`
Content-Type: application/json
\`\`\`

**Request Body:**
\`\`\`json
{
  "api_key": "rcc0085_map_security",
  "token": "abc123xyz"
}
\`\`\`

| Field | Type | Required | Description |
|---|---|---|---|
| `api_key` | string | Yes | Shared API key provided by ELRACE team |
| `token` | string | Yes | The one-time token from the `login_url` |

**Success Response — 200 OK:**
\`\`\`json
{
  "success": true,
  "session_token": "ZWxyYWNlOjE3NDE2OTkwMDA6YWJjMTIz",
  "expires_at": "2026-03-12T12:00:00.000Z",
  "user": {
    "username": "elrace",
    "role": "admin",
    "platform": "elrace-projects",
    "source": "hub"
  },
  "message": "Authentication successful"
}
\`\`\`

**Error Responses:**

\`\`\`json
// 401 — Invalid API key
{ "success": false, "error": "Invalid or missing API key", "code": "INVALID_API_KEY" }

// 400 — Missing token
{ "success": false, "error": "Token is required", "code": "MISSING_TOKEN" }

// 401 — Token not found
{ "success": false, "error": "Token not found or already expired", "code": "INVALID_TOKEN" }

// 401 — Token already used
{ "success": false, "error": "Token has already been used", "code": "TOKEN_USED" }

// 401 — Token expired
{ "success": false, "error": "Token has expired", "code": "TOKEN_EXPIRED" }

// 500 — Server error
{ "success": false, "error": "Internal server error", "code": "SERVER_ERROR" }
\`\`\`

---

## User Callback Page

When the user's browser is redirected to the `login_url`, they land on:

\`\`\`
GET https://elracemap.vercel.app/sso/callback?token=abc123xyz&source=hub
\`\`\`

The platform will:
1. Validate the token automatically
2. Create a browser session for the user
3. Redirect to `https://elracemap.vercel.app/welcome`
4. User is automatically authenticated and has immediate access to the platform
5. **No login page is displayed** — users proceed directly to the welcome page

**Important:** Once a user is authenticated via SSO, they will not see the login page again. They have direct access to the platform resources. No action is required from the hub team for this page — it is handled entirely by the ELRACE platform.

---

## Error Codes Reference

| Code | Meaning | Action |
|---|---|---|
| `INVALID_API_KEY` | API key is missing or incorrect | Check your stored API key |
| `MISSING_TOKEN` | Token field was not sent | Include `token` in request body |
| `INVALID_TOKEN` | Token does not exist or was never created | Generate a new token via `/login-url` |
| `TOKEN_USED` | Token was already consumed | Generate a new token — tokens are single-use |
| `TOKEN_EXPIRED` | Token is older than 5 minutes | Generate a new token — redirect user sooner |
| `SERVER_ERROR` | Unexpected platform error | Retry or contact ELRACE team |


## Security Notes

1. **Never call `/api/sso/login-url` from the browser.** Always call it from your hub backend (server-side). The `api_key` must never be exposed to the client.

2. **Tokens are one-time use.** Once a token is consumed (either at `/sso/callback` or `/api/sso/verify`), it cannot be used again.

3. **Tokens expire in 5 minutes.** Generate the token as close to the redirect as possible.

4. **Store the API key securely.** Use environment variables or a secrets manager. Do not hardcode it.

5. **HTTPS only.** All communication must go over HTTPS. The platform enforces this.

---

## Integration Summary for Hub Team

### Key Points
- **Direct Welcome Access:** After SSO authentication, users are immediately redirected to the welcome page with no login page shown
- **One-Time Tokens:** Each token is single-use and expires in 5 minutes for security
- **Session Management:** ELRACE platform automatically manages user sessions after successful authentication
- **Seamless Experience:** Users experience a seamless transition from the hub to the ELRACE platform

### Implementation Steps for Hub Team
1. Integrate the SSO login endpoint to generate a login URL
2. Redirect authenticated users from the hub to the generated login URL
3. Users will automatically receive platform access upon callback validation
4. (Optional) Use the verify endpoint for additional server-side confirmation

---

## Quick Integration Checklist

- [ ] Receive the `api_key` from the ELRACE team via secure channel
- [ ] Store the `api_key` as an environment variable on your hub server (e.g. `ELRACE_SSO_API_KEY`)
- [ ] Create a route on your hub that calls `POST /api/sso/login-url` server-side
- [ ] Redirect the user's browser to the returned `login_url`
- [ ] (Optional) Call `POST /api/sso/verify` server-side to confirm the session
- [ ] Test the full flow end-to-end in staging before going live

---

## Live Documentation Page

An interactive version of this documentation is available at:

\`\`\`
https://elracemap.vercel.app/sso/docs
\`\`\`

---

## Contact

For API key provisioning, technical questions, or integration support, contact the ELRACE platform team.

**Platform:** https://elracemap.vercel.app  
**Integration Docs:** https://elracemap.vercel.app/sso/docs
