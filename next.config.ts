import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/tenants/st-joseph',
        permanent: false, // Use false in case they want to add more tenants later
      },
    ];
  },
};

export default nextConfig;
