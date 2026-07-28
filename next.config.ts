import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    GATEWAY_URL: process.env.GATEWAY_URL,
  },
};

export default nextConfig;