import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface SmartVisionChatReferenceLinkState {
  use?: boolean;
  reference?: {
    text: string;
    position: {
      top: number;
      left: number;
    };
  };
}
const store = create(immer<SmartVisionChatReferenceLinkState>(() => ({})));

export const useSmartVisionChatReferenceLink = () => {
  const chooseReference = (
    text: string,
    position: { top: number; left: number },
  ) => {
    store.setState((draft) => {
      draft.reference = {
        text,
        position,
      };
    });
  };
  const clearReference = () => {
    store.setState((draft) => {
      draft.reference = undefined;
      draft.use = undefined;
    });
  };
  const useReference = () => {
    store.setState((draft) => {
      draft.use = true;
    });
  };
  return {
    chooseReference,
    clearReference,
    useReference,
  };
};
