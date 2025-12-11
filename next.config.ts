import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */

  webpack(config, { dev }) {
    // 添加别名来解析本地源代码
    if (!config.resolve.alias) {
      config.resolve.alias = {};
    }

    config.resolve.alias = {
      ...config.resolve.alias,
      "@assistant-ui/react$": path.resolve(
        __dirname,
        "../assistant-ui/packages/react/src",
      ),
      "@assistant-ui/react-ai-sdk$": path.resolve(
        __dirname,
        "../assistant-ui/packages/react-ai-sdk/src",
      ),
      "@assistant-ui/react-devtools$": path.resolve(
        __dirname,
        "../assistant-ui/packages/react-devtools/src",
      ),
      "@assistant-ui/react-markdown$": path.resolve(
        __dirname,
        "../assistant-ui/packages/react-markdown/src",
      ),
      "@assistant-ui/react-markdown/styles": path.resolve(
        __dirname,
        "../assistant-ui/packages/react-markdown/styles",
      ),
      "@assistant-ui/tap$": path.resolve(
        __dirname,
        "../assistant-ui/packages/tap/src",
      ),
      "assistant-stream$": path.resolve(
        __dirname,
        "../assistant-ui/packages/assistant-stream/src",
      ),
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
