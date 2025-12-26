import { create, useStore } from "zustand";
import { immer } from "zustand/middleware/immer";
import { useCallback } from "react";

interface SmartVisionChatReferenceLinkState {
  use?: string;
  reference?: {
    text: string;
    position?: {
      top: number;
      left: number;
    };
  };
}
const store = create(immer<SmartVisionChatReferenceLinkState>(() => ({})));

const actionBarRef: { current: HTMLDivElement | null } = { current: null };
export const useSmartVisionChatReferenceStore = <U>(
  selector: (state: SmartVisionChatReferenceLinkState) => U,
) => useStore(store, selector);
export const useSmartVisionChatReferenceLink = () => {
  const referenceText = useStore(store, (state) => {
    if (state.use) {
      return state.reference?.text;
    }
    return undefined;
  });
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
  const clearReference = (withUse = true) => {
    store.setState((draft) => {
      draft.reference = undefined;
      if (withUse) draft.use = undefined;
    });
  };
  const useReference = useCallback(() => {
    store.setState((draft) => {
      draft.use = draft.reference?.text;
      draft.reference = undefined;
    });
  }, []);
  const setActionBarRef = useCallback((ref: HTMLDivElement | null) => {
    actionBarRef.current = ref;
  }, []);

  return {
    setActionBarRef,
    referenceText,
    chooseReference,
    clearReference,
    useReference,
  };
};
