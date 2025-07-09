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
