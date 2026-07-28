import type { NextConfig } from "next";

const nextConfig: NextConfig = {
<<<<<<< HEAD
  typescript: {
    ignoreBuildErrors: true,
  },
=======
  env: {
    GATEWAY_URL: process.env.GATEWAY_URL,
  },
  /* config options here */
>>>>>>> 038f0710ab888d46b5857ea3b22c1c89be7a4b92
};

export default nextConfig;