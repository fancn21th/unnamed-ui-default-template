import React from "react";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useSmartVisionChatRuntime } from "./useSmartVisionChatRuntime";

export function SmartVisionRuntimeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const runtime = useSmartVisionChatRuntime();

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}
