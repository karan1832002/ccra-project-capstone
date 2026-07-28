import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    GATEWAY_URL: process.env.GATEWAY_URL,
  },
  /* config options here */
};

export default nextConfig;