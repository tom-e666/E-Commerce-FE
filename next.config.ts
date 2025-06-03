import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode:false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // Your image host
        port: '',
        pathname: '/**',
      },
      // Add other domains as needed
    ],
    domains: ['localhost', '127.0.0.1'],
    unoptimized: process.env.NODE_ENV !== 'production',
    
  },
};

export default nextConfig;