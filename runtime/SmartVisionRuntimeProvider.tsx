import React, { useEffect } from "react";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useSmartVisionChatRuntime } from "./useSmartVisionChatRuntime";
import { useSmartVisionConfigActions } from "@/runtime/smartVisionConfigRuntime";

export function SmartVisionRuntimeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { load } = useSmartVisionConfigActions();
  const runtime = useSmartVisionChatRuntime();
  useEffect(() => {
    load();
  }, []);
  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}
