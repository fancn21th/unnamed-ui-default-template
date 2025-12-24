import { useMemo } from "react";
import {
  AssistantApi,
  ThreadAssistantMessage,
  ThreadHistoryAdapter,
  ThreadMessage,
  ThreadUserMessage,
  useAssistantApi,
} from "@assistant-ui/react";
import { getConversationsMessages } from "@/runtime/smartvisionApi";
import { nanoid } from "nanoid";
import moment from "moment";

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
      messages.push({
        message: {
          id: d.id,
          createdAt: moment.unix(d.created_at).toDate(),
          role: "assistant",
          status: { type: "complete", reason: "unknown" },
          content: [
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
            custom: {},
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
