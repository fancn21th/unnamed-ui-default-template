"use client";

import React from "react";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useSmartVisionRuntime } from "./useSmartVisionRuntime";

export function SmartVisionRuntimeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const runtime = useSmartVisionRuntime();

  // 使用类型断言来解决 React 19 兼容性问题
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Provider = AssistantRuntimeProvider;

  return <Provider runtime={runtime}>{children}</Provider>;
}
