import {
  RuntimeAdapterProvider,
  type unstable_RemoteThreadListAdapter as RemoteThreadListAdapter,
} from "@assistant-ui/react";
import { FC, PropsWithChildren, useCallback, useMemo } from "react";

import { createAssistantStream } from "assistant-stream";
import { useSmartVisionThreadHistoryAdapter } from "./useSmartVisionThreadHistoryAdapter";
import { SmartVisionFileAttachmentAdapter } from "@/runtime/SmartVisionFileAttachmentAdapter";
import { getConversationsList } from "@/runtime/smartvisionApi";

export const useSmartVisionThreadListAdapter = (): RemoteThreadListAdapter => {
  /**
   * ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️ 注意
   * 一定要实现这个Provider组件
   * 否则无法正确注入自定义的历史记录和附件适配器
   * 这个Adapter的核心关键就是要实现这个Provider，其它的方法都是调用后端API
   * ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
   * */
  const unstable_Provider = useCallback<FC<PropsWithChildren>>(
    function Provider({ children }) {
      /**
       * ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️ 注意
       * 这里的ThreadHistory指的是一个会话的历史消息，它不是会话列表
       * ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
       * */
      const history = useSmartVisionThreadHistoryAdapter();
      const attachments = useMemo(
        () => new SmartVisionFileAttachmentAdapter(),
        [],
      );
      const adapters = useMemo(
        () => ({
          history,
          attachments,
        }),
        [history, attachments],
      );

      return (
        <RuntimeAdapterProvider adapters={adapters}>
          {children}
        </RuntimeAdapterProvider>
      );
    },
    [],
  );
  return {
    async list() {
      const threads = await getConversationsList();
      return {
        threads: threads.map((d) => ({
          status: "regular",
          remoteId: d.id,
          title: d.name,
        })),
      };
    },
    async initialize(localId) {
      const response = await fetch("/api/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ localId }),
      });
      const result = await response.json();
      return { remoteId: result.id, externalId: result.external_id };
    },
    async rename(remoteId, title) {
      await fetch(`/api/threads/${remoteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
    },
    async archive(remoteId) {
      await fetch(`/api/threads/${remoteId}/archive`, { method: "POST" });
    },
    async unarchive(remoteId) {
      await fetch(`/api/threads/${remoteId}/unarchive`, { method: "POST" });
    },
    async delete(remoteId) {
      await fetch(`/api/threads/${remoteId}`, { method: "DELETE" });
    },
    async fetch(remoteId) {
      const response = await fetch(`/api/threads/${remoteId}`);
      const thread = await response.json();
      return {
        status: thread.is_archived ? "archived" : "regular",
        remoteId: thread.id,
        title: thread.title,
      };
    },
    async generateTitle(remoteId, messages) {
      return createAssistantStream(async (controller) => {
        const response = await fetch(`/api/threads/${remoteId}/title`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages }),
        });
        const { title } = await response.json();
        controller.appendText(title);
      });
    },
    unstable_Provider,
  };
};
