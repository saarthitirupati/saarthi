import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Allow HMR to work better with tunnels */
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'https', hostname: 'cdn.sanity.io' },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'ngrok-skip-browser-warning', value: 'true' },
        ],
      },
    ];
  },
  allowedDevOrigins: ['unsubtle-imprint-strudel.ngrok-free.dev'],
  reactStrictMode: true,
};

export default nextConfig;
