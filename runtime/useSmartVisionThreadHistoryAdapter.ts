import { useMemo } from "react";
import {
  AssistantApi,
  ImageMessagePart,
  ThreadAssistantMessage,
  ThreadHistoryAdapter,
  ThreadMessage,
  ThreadUserMessage,
  ToolCallMessagePart,
  useAssistantApi,
} from "@assistant-ui/react";
import { getConversationsMessages } from "@/runtime/smartvisionApi";
import { nanoid } from "nanoid";
import moment from "moment";
import { HIDE_TOOL } from "@/runtime/constants";

class SmartVisionThreadHistoryAdapter implements ThreadHistoryAdapter {
  constructor(private store: AssistantApi) {}

  /**
   * 加载会话的历史消息
   * ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️ 注意
   * 这里的实现是调用后端API获取历史消息
   * 然后将后端返回的消息格式转换为 Assistant UI 需要的消息格式
   * ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
   * */
  async load() {
    const remoteId = this.store.threadListItem().getState().remoteId;
    if (!remoteId) return { messages: [] };
    const data = await getConversationsMessages(remoteId);
    const messages: { message: ThreadMessage; parentId: string | null }[] = [];
    data.forEach((d) => {
      const nanoId = nanoid();
      messages.push({
        message: {
          id: nanoId,
          createdAt: moment.unix(d.created_at).toDate(),
          role: "user",
          content: [
            {
              type: "text",
              text: d.query,
            },
          ],
          attachments: [],
          metadata: { custom: {} },
        } as ThreadUserMessage,
        parentId: null,
      });
      const assistant_message_files = d.message_files?.filter(
        (file) => file.belongs_to === "assistant",
      );
      const toolContents = d.agent_thoughts
        .filter((d) => d.tool && !HIDE_TOOL.includes(d.tool))
        .map((d) => {
          return {
            type: "tool-call",
            toolCallId: d.id,
            toolName: d.tool,
            labels: d.tool_labels?.[d.tool!],
            argsText: d.tool_input,
            result: d.observation,
          } as ToolCallMessagePart & { labels?: Record<string, string> };
        });
      const imageContents = d.agent_thoughts
        .filter((d) => d.files)
        .map((d) => {
          return d.files?.map((id) => {
            const file = assistant_message_files?.find(
              (item) => item.id === id,
            );
            if (file && file.type == "image") {
              return {
                type: "image",
                image: file?.url,
                filename:file.name,
              } as ImageMessagePart;
            }
          });
        })
        .flat().filter(Boolean);
      messages.push({
        message: {
          id: d.id,
          createdAt: moment.unix(d.created_at).toDate(),
          role: "assistant",
          status: { type: "complete", reason: "unknown" },
          content: [
            ...toolContents,
            ...imageContents,
            {
              type: "text",
              text: d.answer,
            },
          ],
          attachments: [],
          metadata: {
            unstable_state: null,
            unstable_annotations: [],
            unstable_data: [],
            steps: [],
            custom: { is_upvote: d.is_upvote },
          },
        } as ThreadAssistantMessage,
        parentId: null,
      });
    });
    return {
      messages,
    };
  }
  async append() {}
}
export const useSmartVisionThreadHistoryAdapter = () => {
  const store = useAssistantApi();

  return useMemo(() => new SmartVisionThreadHistoryAdapter(store), [store]);
};
