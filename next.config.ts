import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: ["172.16.2.3", "172.16.2.8",'172.16.2.7'],
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    minimumCacheTTL: 31536000,
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@react-three/drei'],
  },
};

export default nextConfig;
