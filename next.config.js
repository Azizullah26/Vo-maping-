/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    domains: [
      "localhost",
      "example.com",
      "pbqfgjzvclwgxgvuzmul.supabase.co",
      "hebbkx1anhila5yf.public.blob.vercel-storage.com",
      "api.mapbox.com",
      "placeholder.com",
      "via.placeholder.com",
      "blob.v0.app",
      "igxzfbxlfptgthfxtbae.supabase.co",
    ],
    unoptimized: process.env.NODE_ENV === "development",
  },
  // Environment variables for build time - only non-sensitive public variables
  env: {
    NEXT_PUBLIC_DEMO_MODE: process.env.NEXT_PUBLIC_DEMO_MODE || process.env.DEMO_MODE || "true",
    NEXT_PUBLIC_STATIC_MODE: process.env.NEXT_PUBLIC_STATIC_MODE || process.env.STATIC_MODE || "true",
    NEXT_PUBLIC_VERCEL: process.env.VERCEL || "0",
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version || "1.0.0",
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
        events: false,
      }
    } else {
      config.externals = [...(config.externals || []), "canvas"]
    }

    // Add rule for CSS modules
    config.module.rules.push({
      test: /\.css$/,
      use: ["style-loader", "css-loader"],
    })

    // Add aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": require("path").resolve(__dirname),
    }

    return config
  },
  // Add output configuration for standalone deployment
  output: "standalone",
  // Ensure trailing slashes are handled correctly
  trailingSlash: false,
  // Optimize production builds
  productionBrowserSourceMaps: false,
  // Enable experimental features
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
      allowedOrigins: ["localhost:3000", "*.vercel.app"],
    },
  },
  // Headers for security and performance
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ]
  },
  // Redirects
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
