import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'ngrok-skip-browser-warning', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ];
  },
  allowedDevOrigins: ['localhost:3000', '*.ngrok-free.dev', 'unsubtle-imprint-strudel.ngrok-free.dev'],
};

export default nextConfig;
