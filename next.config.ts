import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
    domains: ['localhost', '127.0.0.1'],
    unoptimized: process.env.NODE_ENV !== 'production',
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;