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
  // Ensure we handle potential unicode issues
  webpack: (config, { isServer }) => {
    // Force webpack to use the correct encoding
    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      use: [
        {
          loader: "string-replace-loader",
          options: {
            search: /\\u(?![0-9a-fA-F]{4})/g,
            replace: "\\\\u",
            flags: "g",
          },
        },
      ],
    })

    return config
  },
}

module.exports = nextConfig
