/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      "localhost",
      "example.com",
      "pbqfgjzvclwgxgvuzmul.supabase.co",
      "hebbkx1anhila5yf.public.blob.vercel-storage.com",
    ],
    unoptimized: true,
  },
  // Environment variables for build time - make sure they're prefixed with NEXT_PUBLIC_
  env: {
    NEXT_PUBLIC_DEMO_MODE: process.env.NEXT_PUBLIC_DEMO_MODE || process.env.DEMO_MODE || "true",
    NEXT_PUBLIC_STATIC_MODE: process.env.NEXT_PUBLIC_STATIC_MODE || process.env.STATIC_MODE || "true",
    NEXT_PUBLIC_VERCEL: process.env.VERCEL || "0",
  },
  // Simplified webpack configuration that doesn't require additional dependencies
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Replace Node.js modules with empty objects or false
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        util: false,
        buffer: false,
        assert: false,
        http: false,
        https: false,
        os: false,
        path: false,
        zlib: false,
      }
    }

    return config
  },
  // Add output configuration for standalone deployment
  output: "standalone",
  // Ensure trailing slashes are handled correctly
  trailingSlash: false,
  experimental: {
    // Updated experimental features for Next.js 15.2.4
  },
}

module.exports = nextConfig
