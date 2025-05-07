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
    domains: ["randomuser.me", "ui-avatars.com"],
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Simplified webpack configuration
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        util: false,
      }
    }

    return config
  },
}

module.exports = nextConfig
