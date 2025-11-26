import { useExternalMessageConverter } from "@assistant-ui/react";
import type { SmartVisionMessage } from "./types";

export const convertSmartVisionMessages: useExternalMessageConverter.Callback<
  SmartVisionMessage
> = (messages) => {
  console.log("🔄 Converting message:", {
    type: messages.type,
    content: messages.content,
    isArray: Array.isArray(messages.content),
  });

  // 转换单个消息为 assistant-ui 格式
  if (messages.type === "human") {
    return {
      role: "user" as const,
      content: [{ type: "text" as const, text: String(messages.content) }],
    };
  } else if (messages.type === "ai") {
    // 🎯 关键修复：正确处理包含 tool-call 的消息
    if (Array.isArray(messages.content)) {
      // 如果 content 是数组，需要转换每个 part 到 assistant-ui 格式
      const convertedContent = messages.content.map((part) => {
        if (part.type === "tool-call") {
          return {
            type: "tool-call" as const,
            toolCallId: part.toolCallId,
            toolName: part.toolName,
            args: part.args as never, // 类型断言解决 ReadonlyJSONObject 问题
            argsText: part.argsText,
          };
        } else if (part.type === "text" || part.type === "text_delta") {
          return {
            type: "text" as const,
            text: part.text,
          };
        } else {
          // 其他类型暂时转换为 text
          return {
            type: "text" as const,
            text: JSON.stringify(part),
          };
        }
      });

      const convertedMessage = {
        role: "assistant" as const,
        content: convertedContent,
      };
      console.log("📋 Converted array content message:", convertedMessage);
      return convertedMessage;
    } else {
      // 如果 content 是字符串，转换为 text 类型
      return {
        role: "assistant" as const,
        content: [{ type: "text" as const, text: String(messages.content) }],
      };
    }
  }
  return {
    role: "system" as const,
    content: [{ type: "text" as const, text: String(messages.content) }],
  };
};
