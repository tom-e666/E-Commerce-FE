import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode:false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        pathname: '**',
      },
    
    ],
    domains: ['localhost', '127.0.0.1'],
    unoptimized: process.env.NODE_ENV !== 'production',
    
  },
};

export default nextConfig;