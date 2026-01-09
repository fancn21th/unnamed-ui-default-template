import { upvoteMessage } from "@/runtime/smartvisionApi";
import { UpvoteStatus } from "@/runtime/types";
import { create, useStore } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useAssistantState } from "@assistant-ui/react";

interface SmartVisionChatActionState {
  upvoteStatusMap: Record<string, UpvoteStatus>;
  dislikeFeedbackMap: Record<string, boolean>;
  deepThink?: boolean;
  webSearch?: boolean;
}
const store = create(
  persist(
    immer<SmartVisionChatActionState>(() => ({
      upvoteStatusMap: {},
      dislikeFeedbackMap: {},
    })),
    {
      name: "smart-vision-action",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        deepThink: s.deepThink,
        webSearch: s.webSearch,
      }),
    },
  ),
);
export const getChatConfig = () => {
  return {
    deepThink: store.getState().deepThink,
    webSearch: store.getState().webSearch,
  };
};
export type QueryMessageActionStatus = {
  like?: boolean;
  dislike?: boolean;
  dislikeFeedback?: boolean;
};
export type QueryComposerActionStatus = {
  deepThink?: boolean;
  webSearch?: boolean;
};
export type QueryActionStatus = QueryMessageActionStatus &
  QueryComposerActionStatus;
export const useSmartVisionActionStore = <U>(
  selector: (state: SmartVisionChatActionState) => U,
) => useStore(store, selector);
export const useSmartVisionMessageActionActions = () => {
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

  const queryMessageStatus = ({
    like,
    dislike,
    dislikeFeedback,
  }: QueryMessageActionStatus): boolean => {
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
    queryMessageStatus,
    onCancelDislikeFeedback,
    onSubmitDislikeFeedback,
  };
};

export const useSmartVisionActionActions = () => {
  const deepThinkState = useSmartVisionActionStore((s) => s.deepThink);
  const webSearchState = useSmartVisionActionStore((s) => s.webSearch);

  const queryStatus = ({
    webSearch,
    deepThink,
  }: QueryComposerActionStatus): boolean => {
    if (deepThink !== undefined) {
      return deepThink === (deepThinkState ?? false);
    }
    if (webSearch !== undefined) {
      return webSearch === (webSearchState ?? false);
    }
    return false;
  };
  /**
   * 切换深度思考
   * */
  const onSwitchDeepThink = () => {
    store.setState((state) => {
      state.deepThink = !state.deepThink;
    });
  };
  /**
   * 切换联网搜索
   * */
  const onSwitchWebSearch = () => {
    store.setState((state) => {
      state.webSearch = !state.webSearch;
    });
  };
  return {
    queryStatus,
    onSwitchDeepThink,
    onSwitchWebSearch,
  };
};
