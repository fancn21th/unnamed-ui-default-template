import { useCallback, useState } from "react";
import { sendSmartVisionMessage } from "./smartvisionApi";
import {
  ImageMessagePart,
  TextMessagePart,
  ThreadAssistantMessage,
  ThreadAssistantMessagePart,
  ThreadMessage,
  ThreadUserMessage,
  ToolCallMessagePart,
  useAssistantApi,
} from "@assistant-ui/react";
import { initializeThreadId } from "@/runtime/smartVisionThreadListAdapterLink";
import { HIDE_TOOL } from "@/runtime/constants";
import { v4 as UUIDv4 } from "uuid";

export const useSmartVisionMessages = () => {
  const api = useAssistantApi();
  const [messages, setMessages] = useState<ThreadMessage[]>([]);

  const updateMessageContent = useCallback(
    (msgId: string, content: ThreadAssistantMessagePart) => {
      setMessages((prev) => {
        const existingMsgIndex = prev.findIndex((d) => d.id === msgId);

        if (existingMsgIndex !== -1) {
          const existingMsg = prev[existingMsgIndex];

          // 查找是否已有相同 id 的 content part
          const existingPartIndex = existingMsg.content.findIndex(
            //@ts-expect-error 类型问题
            (part) => part.id === content.id,
          );

          let newContent: ThreadAssistantMessagePart[];

          if (existingPartIndex !== -1) {
            const existingPart = existingMsg.content[existingPartIndex];

            if (
              existingPart.type === "text" &&
              content.type === "text" &&
              content.text
            ) {
              // ✅ 创建新的 text part，不修改原对象
              const newTextPart: TextMessagePart = {
                ...existingPart,
                text: existingPart.text + content.text, // 累加
              };

              //@ts-expect-error 类型问题
              newContent = [
                ...existingMsg.content.slice(0, existingPartIndex),
                newTextPart,
                ...existingMsg.content.slice(existingPartIndex + 1),
              ];
            } else if (
              existingPart.type === "tool-call" &&
              content.type === "tool-call"
            ) {
              // ✅ 合并 tool-call
              const newToolCallPart: ToolCallMessagePart = {
                ...existingPart,
                ...content,
              };

              //@ts-expect-error 类型问题
              newContent = [
                ...existingMsg.content.slice(0, existingPartIndex),
                newToolCallPart,
                ...existingMsg.content.slice(existingPartIndex + 1),
              ];
            } else if (
              existingPart.type === "image" &&
              content.type === "image"
            ) {
              // ✅ 合并 file
              const newToolCallPart: ImageMessagePart = {
                ...existingPart,
                ...content,
              };

              //@ts-expect-error 类型问题
              newContent = [
                ...existingMsg.content.slice(0, existingPartIndex),
                newToolCallPart,
                ...existingMsg.content.slice(existingPartIndex + 1),
              ];
            } else {
              // 类型不匹配？按新内容处理（或报错）

              //@ts-expect-error 类型问题
              newContent = [...existingMsg.content, content];
            }
          } else {
            // 没有找到相同 id 的 part，直接添加
            //@ts-expect-error 类型问题
            newContent = [...existingMsg.content, content];
          }

          // ✅ 构造新消息对象
          const updatedMsg = {
            ...existingMsg,
            content: newContent,
          };

          // ✅ 构造新 messages 数组
          return [
            ...prev.slice(0, existingMsgIndex),
            updatedMsg,
            ...prev.slice(existingMsgIndex + 1),
          ] as ThreadMessage[];
        } else {
          // 消息不存在，创建新消息
          const newMsg: ThreadAssistantMessage = {
            id: msgId,
            role: "assistant",
            content: [content],
            createdAt: new Date(),
            status: { type: "running" },
            metadata: {
              unstable_state: null,
              unstable_annotations: [],
              unstable_data: [],
              custom: {},
              steps: [],
            },
          };
          return [...prev, newMsg];
        }
      });
    },
    [],
  );
  const completeMessage = useCallback((msgId: string) => {
    setMessages((prev) => {
      const updated = [...prev];
      const find = updated.find((d) => d.id === msgId);
      if (find) {
        //@ts-expect-error 类型问题
        find.status = { type: "complete", reason: "unknown" };
      }
      return updated;
    });
  }, []);
  const sendMessage = useCallback(async (newMessages: ThreadUserMessage) => {
    // 🆕 为 AI 回复创建专门的消息ID
    const remoteId = api.threadListItem().getState().remoteId;
    const localId = api.threadListItem().getState().id;
    let msgId: string | undefined = undefined;
    try {
      // 调用 SmartVision API
      const generator = sendSmartVisionMessage({
        messages: newMessages,
        conversationId: remoteId,
      });

      // 🆕 只添加用户消息，不提前创建 AI 占位符
      setMessages((prev) => [...prev, newMessages]);

      // 处理流式响应
      for await (const chunk of generator) {
        // console.log("📥 Processing chunk:", chunk);
        msgId = chunk.message_id;
        if (chunk.event === "agent_thought") {
          console.log("🧠 检测到 agent_thought 事件:", chunk);

          if (chunk.tool && !HIDE_TOOL.includes(chunk.tool)) {
            // 创建 agent_thought 工具调用消息
            // 根据文档：通过 observation 字段判断状态（存在=完成，不存在=执行中）
            const toolCallMsg: ToolCallMessagePart & {
              tool_execute_time?: number;
            } = {
              id: chunk.id,
              type: "tool-call",
              // @ts-expect-error 类型问题
              toolCallId: chunk.id,
              toolName: chunk.tool,
              args: {},
              // @ts-expect-error 类型问题
              argsText: chunk.tool_input,
              // observation 字段：存在=完成，不存在=执行中
              // 注意：只有当 observation 存在时才设置 result，否则保持 undefined
              result: chunk.observation || undefined,
              labels: chunk.tool_labels?.[chunk.tool],
              // 保存工具执行耗时（秒）
              tool_execute_time: chunk.tool_execute_time ?? undefined,
            };
            if (chunk.message_id)
              updateMessageContent(chunk.message_id, toolCallMsg);
          }
        }
        if (chunk.event === "message_file" && chunk.url) {
          if (chunk.type === "image") {
            const toolCallMsg: ImageMessagePart = {
              // @ts-expect-error 类型问题
              id: chunk.id,
              type: "image",
              image: chunk.url,
            };
            if (chunk.message_id)
              updateMessageContent(chunk.message_id, toolCallMsg);
          }
        }
        if (chunk.event === "agent_message" && chunk.answer) {
          const textMsg: TextMessagePart = {
            //@ts-expect-error 类型问题
            id: chunk.id,
            type: "text",
            text: chunk.answer,
          };

          if (chunk.message_id) updateMessageContent(chunk.message_id, textMsg);
        }
        if (chunk.conversation_id) {
          initializeThreadId(localId, chunk.conversation_id);
        }
      }
    } catch (error) {
      console.error("❌ SmartVision API error:", error);
      const textMsg: TextMessagePart = {
        //@ts-expect-error 类型问题
        id: UUIDv4(),
        type: "text",
        text: "抱歉，发生了错误。请稍后重试。",
      };
      updateMessageContent(UUIDv4(), textMsg);
    } finally {
      if (msgId) completeMessage(msgId);
    }
  }, []);

  return {
    messages,
    sendMessage,
    setMessages,
  };
};
