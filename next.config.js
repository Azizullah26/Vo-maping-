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
  // Simplified webpack configuration
  webpack: (config, { isServer }) => {
    // Add resolve aliases for problematic packages
    config.resolve.alias = {
      ...config.resolve.alias,
      html2canvas: require.resolve("./lib/mock-dependencies.js"),
      canvg: require.resolve("./lib/mock-dependencies.js"),
      "@neondatabase/serverless": require.resolve("./lib/mock-dependencies.js"),
    }

    // Add basic polyfills for Node.js built-in modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        util: require.resolve("util/"),
        fs: false,
        net: false,
      }
    }

    return config
  },
}

module.exports = nextConfig
