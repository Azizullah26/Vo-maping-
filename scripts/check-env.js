#!/usr/bin/env node
// Simple script to check environment variables

console.log("Environment Variables Check:")
console.log("============================")
console.log("MAPBOX_ACCESS_TOKEN:", process.env.MAPBOX_ACCESS_TOKEN ? "✓ Set" : "✗ Not set")
console.log("NEXT_PUBLIC_MAPBOX_TOKEN:", process.env.NEXT_PUBLIC_MAPBOX_TOKEN ? "✓ Set" : "✗ Not set")

if (process.env.MAPBOX_ACCESS_TOKEN) {
  console.log("Token length:", process.env.MAPBOX_ACCESS_TOKEN.length)
  console.log("Token starts with:", process.env.MAPBOX_ACCESS_TOKEN.substring(0, 10))
}
