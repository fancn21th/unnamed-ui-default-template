import React, { useEffect } from "react";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useSmartVisionChatRuntime } from "./useSmartVisionChatRuntime";
import { useSmartVisionConfigActions } from "@/runtime/smartVisionConfigRuntime";
import {
  TavilySearchResultUI,
} from "@/components/assistant-ui/tools/TavilySearchUI";

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
      <TavilySearchResultUI />
      {children}
    </AssistantRuntimeProvider>
  );
}
