/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker
  output: "standalone",

  // Remove deprecated experimental.appDir
  experimental: {
    // Keep this empty or add future experimental features
  },

  // Environment variables
  env: {
    CUSTOM_KEY: "WordSync Production",
  },

  // Performance optimizations for production
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },

  // Image optimization
  images: {
    unoptimized: true, // Disable Next.js image optimization for simpler deployment
  },
};

module.exports = nextConfig;
