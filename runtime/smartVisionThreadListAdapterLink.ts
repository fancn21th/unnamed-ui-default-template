import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { getConversationsList } from "@/runtime/smartvisionApi";

interface SmartVisionThreadListAdapterLinkState {
  threadIdMap: Record<string, string>;
}
const store = create<SmartVisionThreadListAdapterLinkState>()(
  immer(() => ({
    threadIdMap: {},
  })),
);
export const initializeThreadId = (localId: string, remoteId: string) => {
  store.setState((draft) => {
    draft.threadIdMap[localId] = remoteId;
  });
};
export const useSmartVisionThreadListAdapterLink = () => {
  /**
   * 初始化链接
   * */
  const initializeLink = async (localId: string): Promise<string> => {
    const id = store.getState().threadIdMap[localId];
    if (id) {
      return id;
    }
    return new Promise((resolve) => {
      const unSub = store.subscribe((state) => {
        const id = state.threadIdMap[localId];
        if (id) {
          resolve(id);
          unSub();
        }
      });
    });
  };
  const generateTitleLink = async (remoteId: string) => {
    const data = await getConversationsList();
    return data.find((d) => d.id === remoteId)?.name || "";
  };
  return {
    initializeLink,
    generateTitleLink,
  };
};
