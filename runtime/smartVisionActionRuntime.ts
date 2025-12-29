import { upvoteMessage } from "@/runtime/smartvisionApi";
import { UpvoteStatus } from "@/runtime/types";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { useAssistantState } from "@assistant-ui/react";

interface SmartVisionChatActionState {
  upvoteMap: Record<string, UpvoteStatus>;
}
const store = create(
  immer<SmartVisionChatActionState>(() => ({ upvoteMap: {} })),
);
export const useSmartVisionActionActions = () => {
  const messageId = useAssistantState((s) => s.message.id);
  const queryLikeStatus = ({
    like,
    dislike,
  }: {
    like?: boolean;
    dislike?: boolean;
  }): boolean => {
    const status = store.getState().upvoteMap[messageId];
    if (like && status === UpvoteStatus.Like) {
      return true;
    }
    if (dislike && status === UpvoteStatus.Unlike) {
      return true;
    }
    return false;
  };
  const onLike = async () => {
    const res = await upvoteMessage({
      message_id: messageId,
      is_upvote: UpvoteStatus.Like,
    });
    store.setState((state) => {
      state.upvoteMap[messageId] = res.is_upvote ?? UpvoteStatus.None;
    });
  };
  const onDislike = async (content?: string) => {
    const res = await upvoteMessage({
      message_id: messageId,
      is_upvote: UpvoteStatus.Unlike,
      content,
    });
    store.setState((state) => {
      state.upvoteMap[messageId] = res.is_upvote ?? UpvoteStatus.None;
    });
  };
  return {
    onLike,
    onDislike,
    queryLikeStatus,
  };
};
