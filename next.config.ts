import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        pathname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
        pathname: '**',
      },
    ],
    domains: ['localhost', '127.0.0.1', '20.11.66.22'],
    unoptimized: process.env.NODE_ENV !== 'production',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Add headers to handle mixed content
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: process.env.NODE_ENV === 'development' 
              ? "upgrade-insecure-requests; connect-src 'self' http://20.11.66.22:8000 https://*.ngrok-free.app ws://localhost:* wss://localhost:*;"
              : "upgrade-insecure-requests;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;