/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    // Use swc for CSS processing to avoid lightningcss native binding issues
    optimizePackageImports: ["@tailwindcss/postcss"],
  },
  webpack: (config, { isServer }) => {
    // Force lightningcss to use wasm fallback instead of native binary
    if (process.env.NODE_ENV !== "production") {
      process.env.LIGHTNINGCSS_WASM = "true";
    }
    return config;
  },
}

export default nextConfig
