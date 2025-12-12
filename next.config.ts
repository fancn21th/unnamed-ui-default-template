import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  webpack(config, { dev }) {
    // 添加别名来解析本地源代码
    if (!config.resolve.alias) {
      config.resolve.alias = {};
    }

    config.resolve.alias = {
      ...config.resolve.alias,
    };

    // 开发模式下启用源映射和文件监听
    if (dev) {
      config.devtool = "eval-source-map";

      // 监听外部文件变化
      config.watchOptions = {
        ...config.watchOptions,
        ignored: "**/node_modules/**",
        poll: 1000,
      };
    }

    return config;
  },
};

export default nextConfig;
