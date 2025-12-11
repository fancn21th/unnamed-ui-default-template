import { type unstable_RemoteThreadListAdapter as RemoteThreadListAdapter } from "@assistant-ui/react";
import { createAssistantStream } from "assistant-stream";

// 参考 https://www.assistant-ui.com/docs/runtimes/custom/custom-thread-list

export const threadListAdapter: RemoteThreadListAdapter = {
  async list() {
    const response = await fetch("/api/threads");
    const threads = await response.json();
    return {
      threads: threads.map((thread: any) => ({
        remoteId: thread.id,
        externalId: thread.external_id ?? undefined,
        status: thread.is_archived ? "archived" : "regular",
        title: thread.title ?? undefined,
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
};
