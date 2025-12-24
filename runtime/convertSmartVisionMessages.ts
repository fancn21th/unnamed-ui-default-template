import {
  ThreadMessage,
  useExternalMessageConverter,
} from "@assistant-ui/react";
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
      content:
        typeof messages.content === "string"
          ? [{ type: "text" as const, text: String(messages.content) }]
          : messages.content.map((d) => {
              if (d.type === "text") {
                return {
                  type: "text",
                  text: d.text,
                };
              }
              return {
                type: "text",
                text: "",
              };
            }),
      attachments: messages.attachments,
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

export const getSmartVisionMessage = (
  message: ThreadMessage,
): SmartVisionMessage => {
  if (message.role === "user") {
    return {
      type: "human",
      id: message.id,
      content: message.content
        .map((part) =>
          part.type === "text" ? part.text : JSON.stringify(part),
        )
        .join(""),
    } as SmartVisionMessage;
  }
  if (message.role === "assistant") {
    return {
      type: "ai",
      id: message.id,
      content: message.content.map((part) => {
        if (part.type === "tool-call") {
          return {
            type: "tool-call",
            toolCallId: (part as any).toolCallId,
            toolName: (part as any).toolName,
            args: (part as any).args,
            argsText: (part as any).argsText,
          };
        } else if (part.type === "text") {
          return {
            type: "text",
            text: part.text,
          };
        } else {
          return {
            type: "text",
            text: JSON.stringify(part),
          };
        }
      }),
    } as SmartVisionMessage;
  }
  return {
    type: "system",
    id: message.id,
    content: message.content
      .map((part) => (part.type === "text" ? part.text : JSON.stringify(part)))
      .join(""),
  } as SmartVisionMessage;
};
