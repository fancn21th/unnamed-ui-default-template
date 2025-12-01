import { type unstable_RemoteThreadListAdapter as RemoteThreadListAdapter } from "@assistant-ui/react";
import { getConversationsList } from "@/runtime/smartvisionApi";
import { createAssistantStream } from "assistant-stream";

export const threadListAdapter: RemoteThreadListAdapter = {
  list: getConversationsList,
  initialize: async (threadId) => {
    return {
      remoteId: threadId,
      externalId: undefined,
    };
  },
  generateTitle: async (remoteId, unstable_messages) => {
    return createAssistantStream((controller) => {
      const firstUserMessage = unstable_messages.find((m) => m.role === "user");
      if (firstUserMessage) {
        const content = firstUserMessage.content
          .filter((c) => c.type === "text")
          .map((c) => c.text)
          .join(" ");
        const title = content.slice(0, 50) + (content.length > 50 ? "..." : "");
        controller.appendText(title);
      } else {
        controller.appendText("New Chat");
      }
    });
  },
};
