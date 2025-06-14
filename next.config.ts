import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/apply',
  assetPrefix: '/apply',
  // 确保API路由正确工作
  async rewrites() {
    return [
      {
        source: '/apply/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
};

export default nextConfig;
