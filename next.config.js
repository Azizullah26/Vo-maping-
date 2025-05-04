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
  // Remove the webpack configuration that uses string-replace-loader
}

module.exports = nextConfig
