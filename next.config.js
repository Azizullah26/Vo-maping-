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
    // For server-side rendering, provide empty mocks for browser-only modules
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        html2canvas: require.resolve("./lib/empty-module.js"),
        canvg: require.resolve("./lib/empty-module.js"),
        jspdf: require.resolve("./lib/empty-module.js"),
        "jspdf-autotable": require.resolve("./lib/empty-module.js"),
      }
    }

    // For client-side, provide fallbacks for node modules
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
