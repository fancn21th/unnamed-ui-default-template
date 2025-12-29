import { upvoteMessage } from "@/runtime/smartvisionApi";
import { UpvoteStatus } from "@/runtime/types";
import { create, useStore } from "zustand";
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
  const upvoteStatus = useAssistantState(
    (s) => s.message.metadata.custom.is_upvote,
  );
  const cacheUpvoteStatus = useStore(store, (s) => s.upvoteMap[messageId]);
  const queryLikeStatus = ({
    like,
    dislike,
  }: {
    like?: boolean;
    dislike?: boolean;
  }): boolean => {
    const status = cacheUpvoteStatus || upvoteStatus || UpvoteStatus.None;
    if (like) {
      return status === UpvoteStatus.Like;
    } else if (like === false) {
      return status !== UpvoteStatus.Like;
    }
    if (dislike) {
      return status === UpvoteStatus.Unlike;
    } else if (dislike === false) {
      return status !== UpvoteStatus.Unlike;
    }
    return status === UpvoteStatus.None;
  };
  const onLike = async () => {
    const status = cacheUpvoteStatus || upvoteStatus;
    const res = await upvoteMessage({
      message_id: messageId,
      is_upvote:
        status === UpvoteStatus.Like ? UpvoteStatus.None : UpvoteStatus.Like,
    });
    store.setState((state) => {
      state.upvoteMap[messageId] = res.is_upvote ?? UpvoteStatus.None;
    });
  };
  const onDislike = async (content?: string) => {
    const status = cacheUpvoteStatus || upvoteStatus;
    const res = await upvoteMessage({
      message_id: messageId,
      is_upvote:
        status === UpvoteStatus.Unlike
          ? UpvoteStatus.None
          : UpvoteStatus.Unlike,
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
