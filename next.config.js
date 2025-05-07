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
  // Simplified webpack configuration
  webpack: (config) => {
    // Add resolve aliases for problematic packages
    config.resolve.alias = {
      ...config.resolve.alias,
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
