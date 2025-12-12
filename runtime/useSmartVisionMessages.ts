import type { SmartVisionMessage } from "./types";
import { useCallback, useState } from "react";
import { sendSmartVisionMessage } from "./smartvisionApi";
import { findMessageById, generateUniqueId } from "./helpers";

export const useSmartVisionMessages = () => {
  const [messages, setMessages] = useState<SmartVisionMessage[]>([]);

  const sendMessage = useCallback(async (newMessages: SmartVisionMessage[]) => {
    // 🆕 为 AI 回复创建专门的消息ID
    let aiResponseId: string | null = null; // 🆕 延迟初始化

    try {
      // 调用 SmartVision API
      const generator = sendSmartVisionMessage({
        messages: newMessages,
      });

      // 🆕 只添加用户消息，不提前创建 AI 占位符
      setMessages((prev) => [...prev, ...newMessages]);

      let responseContent = "";

      // 处理流式响应
      for await (const chunk of generator) {
        // console.log("📥 Processing chunk:", chunk);

        if (chunk.event === "agent_thought") {
          console.log("🧠 检测到 agent_thought 事件:", chunk);

          // 准备 agent_thought 参数
          const thoughtArgs = {
            thought: chunk.thought || "",
            tool: chunk.tool || "",
            tool_input: chunk.tool_input || null,
            observation: chunk.observation || "",
            timestamp: new Date().toISOString(),
          };

          // 创建 agent_thought 工具调用消息
          const agentThoughtMessage: SmartVisionMessage = {
            id: generateUniqueId("agent_thought"),
            type: "ai",
            content: [
              {
                type: "tool-call",
                toolCallId: `thought_${Date.now()}`,
                toolName: "agent_thought",
                args: thoughtArgs,
                argsText: JSON.stringify(thoughtArgs, null, 2),
              },
            ],
          };

          console.log("🔗 创建工具调用消息，ID:", agentThoughtMessage.id);
          setMessages((prev) => [...prev, agentThoughtMessage]);
        }

        if (chunk.event === "agent_message" && chunk.answer) {
          // 🆕 第一次收到 agent_message 时创建 AI 回复
          if (!aiResponseId) {
            aiResponseId = generateUniqueId("ai_response");
            const aiMessage: SmartVisionMessage = {
              id: aiResponseId,
              type: "ai",
              content: chunk.answer, // 🎯 直接设置内容
            };
            setMessages((prev) => [...prev, aiMessage]);
            responseContent = chunk.answer;
          } else {
            // 🆕 后续更新已存在的 AI 回复
            responseContent += chunk.answer;
            setMessages((prev) => {
              const updated = [...prev];
              const targetIndex = findMessageById(updated, aiResponseId!);
              if (targetIndex !== -1) {
                updated[targetIndex] = {
                  ...updated[targetIndex],
                  content: responseContent,
                };
              }
              return updated;
            });
          }

          console.log("💬 更新 AI 回复，ID:", aiResponseId);
        }
      }
    } catch (error) {
      console.error("❌ SmartVision API error:", error);

      // 🆕 错误处理：只在已创建 AI 消息时更新
      if (aiResponseId) {
        setMessages((prev) => {
          const updated = [...prev];
          const targetIndex = findMessageById(updated, aiResponseId!);
          if (targetIndex !== -1) {
            updated[targetIndex] = {
              ...updated[targetIndex],
              content: "抱歉，发生了错误。请稍后重试。",
            };
          }
          return updated;
        });
      } else {
        // 🆕 如果还没创建 AI 消息，直接添加错误消息
        const errorMessage: SmartVisionMessage = {
          id: generateUniqueId("ai_error"),
          type: "ai",
          content: "抱歉，发生了错误。请稍后重试。",
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } finally {
    }
  }, []);

  return {
    messages,
    sendMessage,
    setMessages,
  };
};
