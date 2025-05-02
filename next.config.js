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
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `pg` module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        pg: false,
        "pg-native": false,
        "pg-hstore": false,
        "aws-crt": false,
        "node-gyp": false,
        "node-pre-gyp": false,
        libpq: false,
      }
    }

    // Add aliases for missing dependencies
    config.resolve.alias = {
      ...config.resolve.alias,
      html2canvas: require.resolve("./lib/mock-dependencies.js"),
      canvg: require.resolve("./lib/mock-dependencies.js"),
    }

    return config
  },
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
  experimental: {
    serverComponentsExternalPackages: ["@neondatabase/serverless"],
  },
  env: {
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN:
      process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
  },
}

module.exports = nextConfig
