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
  // Enhanced webpack configuration to handle Node.js modules properly
  webpack: (config, { isServer }) => {
    // Add resolve aliases for problematic packages
    config.resolve.alias = {
      ...config.resolve.alias,
      html2canvas: require.resolve("./lib/mock-dependencies.js"),
      canvg: require.resolve("./lib/mock-dependencies.js"),
      "@neondatabase/serverless": require.resolve("./lib/mock-dependencies.js"),
    }

    // Add polyfills for Node.js built-in modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        util: require.resolve("util/"),
        stream: require.resolve("stream-browserify"),
        crypto: require.resolve("crypto-browserify"),
        http: require.resolve("stream-http"),
        https: require.resolve("https-browserify"),
        zlib: require.resolve("browserify-zlib"),
        path: require.resolve("path-browserify"),
        fs: false,
        net: false,
        tls: false,
        child_process: false,
      }
    }

    // Ensure proper handling of the util.inherits function
    config.module.rules.push({
      test: /\.js$/,
      include: /node_modules/,
      use: [
        {
          loader: "babel-loader",
          options: {
            presets: ["next/babel"],
            plugins: [["@babel/plugin-transform-modules-commonjs"]],
          },
        },
      ],
    })

    return config
  },
  // Removed the deprecated "target" property
}

module.exports = nextConfig
