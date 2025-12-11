import { useState } from "react";
import {
  useExternalStoreRuntime,
  useExternalMessageConverter,
} from "@assistant-ui/react";
import type { SmartVisionMessage } from "./types";
import { useSmartVisionMessages } from "./useSmartVisionMessages";
import { convertSmartVisionMessages } from "./convertSmartVisionMessages";
import { unstable_useRemoteThreadListRuntime as useRemoteThreadListRuntime } from "@assistant-ui/react";
import { threadListAdapter } from "./threadListAdapter";

// 创建符合 assistant-ui 标准的运行时
export const useSmartVisionRuntime = () => {
  const [isRunning, setIsRunning] = useState(false);
  const { messages, sendMessage } = useSmartVisionMessages();

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

  const smartvisionAssistantRuntime = useExternalStoreRuntime({
    isRunning,
    messages: threadMessages,
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
  });

  const runtime = useRemoteThreadListRuntime({
    runtimeHook: () => smartvisionAssistantRuntime,
    adapter: threadListAdapter,
  });

  return runtime;
};
