/** @type {import('next').NextConfig} */
const path = require("path")
const CopyWebpackPlugin = require("copy-webpack-plugin")

const nextConfig = {
  images: {
    domains: ["hebbkx1anhila5yf.public.blob.vercel-storage.com"],
    unoptimized: process.env.NODE_ENV === "development",
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        http: false,
        https: false,
        zlib: false,
        url: false,
      }
    }

    config.plugins.push(
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.join(path.dirname(require.resolve("cesium")), "Build/Cesium/Workers"),
            to: "static/Workers",
          },
          {
            from: path.join(path.dirname(require.resolve("cesium")), "Build/Cesium/ThirdParty"),
            to: "static/ThirdParty",
          },
          {
            from: path.join(path.dirname(require.resolve("cesium")), "Build/Cesium/Assets"),
            to: "static/Assets",
          },
          {
            from: path.join(path.dirname(require.resolve("cesium")), "Build/Cesium/Widgets"),
            to: "static/Widgets",
          },
        ],
      }),
    )

    return config
  },
  // Add CORS headers for Cesium assets
  async headers() {
    return [
      {
        source: "/static/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
        ],
      },
    ]
  },
}

module.exports = nextConfig
