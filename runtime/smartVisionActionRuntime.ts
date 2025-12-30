import { upvoteMessage } from "@/runtime/smartvisionApi";
import { UpvoteStatus } from "@/runtime/types";
import { create, useStore } from "zustand";
import { immer } from "zustand/middleware/immer";
import { useAssistantState } from "@assistant-ui/react";

interface SmartVisionChatActionState {
  upvoteStatusMap: Record<string, UpvoteStatus>;
  dislikeFeedbackMap: Record<string, boolean>;
}
const store = create(
  immer<SmartVisionChatActionState>(() => ({
    upvoteStatusMap: {},
    dislikeFeedbackMap: {},
  })),
);

export const useSmartVisionActionStore = <U>(
  selector: (state: SmartVisionChatActionState) => U,
) => useStore(store, selector);
export const useSmartVisionActionActions = () => {
  const messageId = useAssistantState((s) => s.message.id);
  const upvoteStatus = useAssistantState(
    (s) => s.message.metadata.custom.is_upvote,
  );
  const cacheUpvoteStatus = useStore(
    store,
    (s) => s.upvoteStatusMap[messageId],
  );
  const cacheDislikeFeedback = useStore(
    store,
    (s) => s.dislikeFeedbackMap[messageId],
  );
  const queryLikeStatus = ({
    like,
    dislike,
    dislikeFeedback,
  }: {
    like?: boolean;
    dislike?: boolean;
    dislikeFeedback?: boolean;
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
    if (dislikeFeedback) {
      return cacheDislikeFeedback;
    }
    return false;
  };
  const onLike = async () => {
    const status = cacheUpvoteStatus || upvoteStatus;
    const res = await upvoteMessage({
      message_id: messageId,
      is_upvote:
        status === UpvoteStatus.Like ? UpvoteStatus.None : UpvoteStatus.Like,
    });
    store.setState((state) => {
      state.upvoteStatusMap[messageId] = res.is_upvote ?? UpvoteStatus.None;
    });
  };
  /**
   * 点踩点击事件
   * */
  const onDislikeClick = async () => {
    const status = cacheUpvoteStatus || upvoteStatus;
    if (status === UpvoteStatus.Unlike) {
      const res = await upvoteMessage({
        message_id: messageId,
        is_upvote: UpvoteStatus.None,
      });
      store.setState((state) => {
        state.upvoteStatusMap[messageId] = res.is_upvote ?? UpvoteStatus.None;
      });
    } else {
      store.setState((state) => {
        state.dislikeFeedbackMap[messageId] = true;
      });
    }
  };
  /**
   * 取消点踩反馈
   * */
  const onCancelDislikeFeedback = async () => {
    const res = await upvoteMessage({
      message_id: messageId,
      is_upvote: UpvoteStatus.Unlike,
    });
    store.setState((state) => {
      state.upvoteStatusMap[messageId] = res.is_upvote ?? UpvoteStatus.None;
      state.dislikeFeedbackMap[messageId] = false;
    });
  };
  /**
   * 提交点踩反馈
   * */
  const onSubmitDislikeFeedback = async (content: string) => {
    const res = await upvoteMessage({
      message_id: messageId,
      is_upvote: UpvoteStatus.Unlike,
      content,
    });
    store.setState((state) => {
      state.upvoteStatusMap[messageId] = res.is_upvote ?? UpvoteStatus.None;
      state.dislikeFeedbackMap[messageId] = false;
    });
  };
  return {
    onLike,
    onDislikeClick,
    queryLikeStatus,
    onCancelDislikeFeedback,
    onSubmitDislikeFeedback,
  };
};
