/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
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
    // Disable some experimental features that might cause issues
    serverActions: true,
    serverComponentsExternalPackages: [],
  },
}

module.exports = nextConfig
