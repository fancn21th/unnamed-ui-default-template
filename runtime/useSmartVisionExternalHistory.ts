import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import {
  AssistantRuntime,
  ThreadHistoryAdapter,
  ThreadMessage,
  useAssistantApi,
} from "@assistant-ui/react";

export const useSmartVisionExternalHistory = <TMessage>(
  runtimeRef: RefObject<AssistantRuntime>,
  historyAdapter: ThreadHistoryAdapter | undefined,
  toStoreMessage: (messages: ThreadMessage) => TMessage,
  onSetMessages: (messages: TMessage[]) => void,
) => {
  const loadedRef = useRef(false);

  const api = useAssistantApi();
  const optionalThreadListItem = useCallback(
    () => (api.threadListItem.source ? api.threadListItem() : null),
    [api],
  );

  const [isLoading, setIsLoading] = useState(
    // we only load history if there is a remote id
    () => optionalThreadListItem()?.getState().remoteId !== undefined,
  );

  const historyIds = useRef(new Set<string>());

  const onSetMessagesRef = useRef<typeof onSetMessages>(() => onSetMessages);
  useEffect(() => {
    onSetMessagesRef.current = onSetMessages;
  });

  // Load messages from history adapter on mount
  useEffect(() => {
    if (!historyAdapter || loadedRef.current) return;

    const loadHistory = async () => {
      setIsLoading(true);
      try {
        const repo = await historyAdapter.load();
        if (repo && repo.messages.length > 0) {
          onSetMessagesRef.current(
            repo.messages
              .map((d) => toStoreMessage(d.message))
              .filter(Boolean)
              .flat() as TMessage[],
          );

          historyIds.current = new Set(repo.messages.map((m) => m.message.id));
        }
      } catch (error) {
        console.error("Failed to load message history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!loadedRef.current) {
      loadedRef.current = true;
      if (!optionalThreadListItem()?.getState().remoteId) {
        setIsLoading(false);
        return;
      }

      loadHistory();
    }
  }, [api, historyAdapter, runtimeRef, optionalThreadListItem]);

  return isLoading;
};
