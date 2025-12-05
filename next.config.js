/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
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
    unoptimized: false,
  },

  env: {
    NEXT_PUBLIC_DEMO_MODE: process.env.NEXT_PUBLIC_DEMO_MODE || "true",
    NEXT_PUBLIC_STATIC_MODE: process.env.NEXT_PUBLIC_STATIC_MODE || "false",
    NEXT_PUBLIC_APP_VERSION: "1.0.0",
  },

  webpack: (config, { isServer }) => {
    // Server-side: externalize heavy packages to avoid bundling
    if (isServer) {
      config.externals = config.externals || []
      if (Array.isArray(config.externals)) {
        config.externals.push(
          "pg",
          "mapillary-js",
          "three",
          "edgedb",
          "@react-three/fiber",
          "@react-three/drei",
          "ol",
          "lodash",
        )
      }
    }

    // Client-side: exclude Node.js modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        path: false,
        child_process: false,
        pg: false,
      }
    }

    config.optimization = {
      ...config.optimization,
      moduleIds: "deterministic",
      minimize: true,
      splitChunks: {
        chunks: "all",
        maxInitialRequests: 25,
        minSize: 20000,
        cacheGroups: {
          default: false,
          vendors: false,
          lib: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)?.[1]
              return `npm.${packageName?.replace("@", "")}`
            },
            priority: 10,
          },
        },
      },
    }

    return config
  },

  trailingSlash: false,
  productionBrowserSourceMaps: false,

  output: "standalone",

  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons", "lodash"],
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
            value: "SAMEORIGIN",
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
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0",
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
