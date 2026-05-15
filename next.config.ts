import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: ["172.16.2.3", "172.16.2.8"],
};

export default nextConfig;
