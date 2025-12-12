import {
  AssistantRuntime,
  useExternalMessageConverter,
  useExternalStoreRuntime,
  useRuntimeAdapters,
} from "@assistant-ui/react";
import { useMemo, useState } from "react";
import { useSmartVisionMessages } from "./useSmartVisionMessages";
import {
  convertSmartVisionMessages,
  getSmartVisionMessage,
} from "@/runtime/convertSmartVisionMessages";
import { SmartVisionMessage } from "@/runtime/types";
import { useSmartVisionExternalHistory } from "./useSmartVisionExternalHistory";

export const useSmartVisionChatThreadRuntime = () => {
  const [isRunning, setIsRunning] = useState(false);
  const { messages, sendMessage, setMessages } = useSmartVisionMessages();

  const handleSendMessage = async (newMessages: SmartVisionMessage[]) => {
    try {
      setIsRunning(true);
      await sendMessage(newMessages);
    } catch (error) {
      console.error("Error streaming messages:", error);
    } finally {
      setIsRunning(false);
    }
  };

  // 转换消息格式为 assistant-ui 标准格式
  const threadMessages = useExternalMessageConverter({
    callback: convertSmartVisionMessages,
    messages,
    isRunning,
  });

  const runtimeRef = useMemo(
    () => ({
      get current(): AssistantRuntime {
        return runtime;
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const contextAdapters = useRuntimeAdapters();
  const isLoading = useSmartVisionExternalHistory(
    runtimeRef,
    contextAdapters?.history,
    getSmartVisionMessage,
    setMessages,
  );
  const runtime = useExternalStoreRuntime({
    isRunning,
    messages: threadMessages,
    setMessages: (messages) =>
      setMessages(messages.map(getSmartVisionMessage).filter(Boolean).flat()),
    onNew: async (message) => {
      console.log("🚀 SmartVision onNew:", message);

      // 创建用户消息
      const userMessage: SmartVisionMessage = {
        id: `user_${Date.now()}`,
        type: "human",
        content:
          typeof message.content === "string"
            ? message.content
            : message.content
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .map((c: any) => (c.type === "text" ? c.text : ""))
                .join(""),
      };

      await handleSendMessage([userMessage]);
    },
    onImport: (messages) =>
      setMessages(messages.map(getSmartVisionMessage).filter(Boolean).flat()),
    isLoading,
  });
  return runtime;
};
