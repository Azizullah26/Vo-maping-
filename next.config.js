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
  // Improved webpack configuration to handle polyfills
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Replace Node.js modules with browser-compatible versions or empty objects
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        util: require.resolve("util/"),
        buffer: require.resolve("buffer/"),
        assert: require.resolve("assert/"),
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
  // Moved from experimental.serverComponentsExternalPackages
  serverExternalPackages: [],
}

module.exports = nextConfig
