import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
  },
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true, // This will ignore ESLint errors during production build
  },
};

export default nextConfig;
