import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/exercises/:path*',
        destination: 'https://candidate.staging.future.co/sandbox/api/exercises/:path*',
      },
    ];
  },
};

export default nextConfig;
