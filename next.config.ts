import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    'localhost:3000',
    '0.0.0.0:3000',
    '192.168.31.106',
    '192.168.*.*',
    'reproduction-cleaner-operates-catalog.trycloudflare.com',
    '*.trycloudflare.com',
  ],
  experimental: {
    serverActions: {
      allowedOrigins: [
        'reproduction-cleaner-operates-catalog.trycloudflare.com',
        '*.trycloudflare.com',
      ],
    },
  },
};

export default nextConfig;
