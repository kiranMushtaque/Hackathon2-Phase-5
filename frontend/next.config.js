/** @type {import('next').NextConfig} */
const nextConfig = {
  // Phase 5 Docker deployment ke liye sabse zaroori line
  output: "standalone",

  // App router aur experimental features
  experimental: {
    appDir: true,
  },

  // Backend API URL configuration
  env: {
    NEXT_PUBLIC_BACKEND_API_URL:
      process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8000",
  },

  // Image handling (agar aap koi external images use kar rahe hain)
  images: {
    domains: ["localhost"],
  },
};

module.exports = nextConfig;
