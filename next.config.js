/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize for production builds
  output: 'standalone',
  
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['@types/node'],
  },
  
  // Optimize images and static assets
  images: {
    unoptimized: false,
    formats: ['image/webp', 'image/avif'],
  },
  
  // Enable compression
  compress: true,
  
  // Environment variables for build time
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

module.exports = nextConfig;
