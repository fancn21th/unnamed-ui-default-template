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
} from "./convertSmartVisionMessages";
import { SmartVisionContentPart, SmartVisionMessage } from "@/runtime/types";
import { useSmartVisionExternalHistory } from "./useSmartVisionExternalHistory";
import { smartVisionFileAttachmentAdapter } from "./SmartVisionFileAttachmentAdapter";

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
        content: message.content.map((c) => {
          if (c.type === "text")
            return { type: "text", text: c.text } as SmartVisionContentPart;
          return { type: "text", text: "" } as SmartVisionContentPart;
        }),
        attachments: message.attachments,
      };
      await handleSendMessage([userMessage]);
    },
    onImport: (messages) =>
      setMessages(messages.map(getSmartVisionMessage).filter(Boolean).flat()),
    onEdit: async () => {},
    isLoading,
    adapters: {
      /**
       * ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️ 注意
       * 附件Adapter依然使用老的方式实现
       * ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
       * */
      attachments: smartVisionFileAttachmentAdapter,
    },
  });
  return runtime;
};
