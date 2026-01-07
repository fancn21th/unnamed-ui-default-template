import {
  ThreadMessage,
  ThreadUserMessage,
  useExternalStoreRuntime,
  useRuntimeAdapters,
} from "@assistant-ui/react";
import { useState } from "react";
import { useSmartVisionMessages } from "./useSmartVisionMessages";
import { useSmartVisionExternalHistory } from "./useSmartVisionExternalHistory";
import { smartVisionFileAttachmentAdapter } from "./SmartVisionFileAttachmentAdapter";
import {
  useSmartVisionChatReferenceActions,
  useSmartVisionChatReferenceStore,
} from "@/runtime/smartVisionReferenceRuntime";

export const useSmartVisionChatThreadRuntime = () => {
  const [isRunning, setIsRunning] = useState(false);
  const { messages, sendMessage, setMessages } = useSmartVisionMessages();
  const { clearReference } = useSmartVisionChatReferenceActions();

  const handleSendMessage = async (newMessages: ThreadUserMessage) => {
    clearReference();
    try {
      setIsRunning(true);
      await sendMessage(newMessages);
    } catch (error) {
      console.error("Error streaming messages:", error);
    } finally {
      setIsRunning(false);
    }
  };

  const contextAdapters = useRuntimeAdapters();
  const isLoading = useSmartVisionExternalHistory(
    contextAdapters?.history,
    setMessages,
  );
  const reference = useSmartVisionChatReferenceStore((s) => s.reference);
  const runtime = useExternalStoreRuntime({
    isRunning,
    messages: messages,
    setMessages: (messages) => setMessages(messages as ThreadMessage[]),
    onNew: async (message) => {
      console.log("🚀 SmartVision onNew:", message);

      await handleSendMessage({
        id: `user_${Date.now()}`,
        ...message,
        metadata: {
          ...message.metadata,
          custom: {
            ...message.metadata.custom,
            reference: reference,
            // tools: [
            //   {
            //     id: 1657,
            //     name: "饼图",
            //     provider_type: "builtin",
            //   },
            // ],
          },
        },
      } as ThreadUserMessage);
    },
    onImport: (messages) => setMessages(messages as ThreadMessage[]),
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
