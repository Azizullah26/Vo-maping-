/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,

  eslint: {
    ignoreDuringBuilds: false,
  },

  typescript: {
    ignoreBuildErrors: false,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "**.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "api.mapbox.com",
      },
      {
        protocol: "https",
        hostname: "blob.v0.app",
      },
      {
        protocol: "https",
        hostname: "placeholder.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],
    unoptimized: process.env.NODE_ENV === "development",
  },

  env: {
    NEXT_PUBLIC_DEMO_MODE: process.env.NEXT_PUBLIC_DEMO_MODE || "true",
    NEXT_PUBLIC_STATIC_MODE: process.env.NEXT_PUBLIC_STATIC_MODE || "true",
    NEXT_PUBLIC_VERCEL: process.env.VERCEL || "0",
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    NEXT_PUBLIC_APP_VERSION: "1.0.0",
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
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
    }

    return config
  },

  output: "standalone",
  trailingSlash: false,
  productionBrowserSourceMaps: false,

  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
      allowedOrigins: ["localhost:3000", "*.vercel.app"],
    },
  },

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
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ]
  },

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
