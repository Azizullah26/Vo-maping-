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
    domains: ["localhost", "example.com"],
    unoptimized: true,
  },
  // Add webpack configuration to resolve html2canvas and canvg to our mock implementations
  webpack: (config, { isServer }) => {
    // Add resolve aliases for the problematic packages
    config.resolve.alias = {
      ...config.resolve.alias,
      html2canvas: require.resolve("./lib/mock-dependencies.js"),
      canvg: require.resolve("./lib/mock-dependencies.js"),
    }

    return config
  },
}

module.exports = nextConfig
