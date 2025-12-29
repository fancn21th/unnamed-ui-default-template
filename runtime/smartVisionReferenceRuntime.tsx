import { create, useStore } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";

type ReferenceType = {
  text: string;
  position: {
    top: number;
    left: number;
  };
};
const ReferenceContext = createContext<{
  reference?: ReferenceType;
  onChoose?: (text: string, position: { top: number; left: number }) => void;
  onClear?: () => void;
}>({});

export const ReferenceProvider: FC<PropsWithChildren> = ({ children }) => {
  const [reference, setReference] = useState<ReferenceType>();
  const onChoose = (text: string, position: { top: number; left: number }) => {
    setReference({ text, position });
  };
  const onClear = () => {
    setReference(undefined);
  };
  return (
    <ReferenceContext.Provider value={{ reference, onChoose, onClear }}>
      {children}
    </ReferenceContext.Provider>
  );
};
export const useReferenceProviderContext = () => {
  return useContext(ReferenceContext);
};

interface SmartVisionChatReferenceState {
  reference?: string;
}
const store = create(immer<SmartVisionChatReferenceState>(() => ({})));

export const useSmartVisionChatReferenceStore = <U,>(
  selector: (state: SmartVisionChatReferenceState) => U,
) => useStore(store, selector);
export const useSmartVisionChatReferenceActions = () => {
  const clearReference = () => {
    store.setState((draft) => {
      draft.reference = undefined;
    });
  };
  const applyReference = useCallback((text: string) => {
    store.setState((draft) => {
      draft.reference = text;
    });
  }, []);

  return {
    clearReference,
     applyReference,
  };
};
