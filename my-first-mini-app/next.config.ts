import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['static.usernames.app-backend.toolsforhumanity.com'],
  },
  allowedDevOrigins: ['https://d2e8-176-114-240-43.ngrok-free.app', 'http://localhost:3000'],
  reactStrictMode: false,
};

export default nextConfig;
