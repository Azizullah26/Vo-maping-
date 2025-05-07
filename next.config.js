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
    // Simplified fallbacks - only include what's necessary
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        // Remove dependencies we don't have installed
        // crypto: require.resolve("crypto-browserify"),
        // stream: require.resolve("stream-browserify"),
        // path: require.resolve("path-browserify"),
        // zlib: require.resolve("browserify-zlib"),
        // http: require.resolve("stream-http"),
        // https: require.resolve("https-browserify"),
        util: false,
      }
    }

    return config
  },
}

module.exports = nextConfig
