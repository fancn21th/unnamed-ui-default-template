import { create, useStore } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
  ComponentPropsWithoutRef,
  type ComponentRef,
  createContext,
  FC,
  forwardRef,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Primitive } from "@radix-ui/react-primitive";
import { useComposedRefs } from "@radix-ui/react-compose-refs";

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

interface SmartVisionChatReferenceLinkState {
  reference?: string;
}
const store = create(immer<SmartVisionChatReferenceLinkState>(() => ({})));

export const useSmartVisionChatReferenceStore = <U,>(
  selector: (state: SmartVisionChatReferenceLinkState) => U,
) => useStore(store, selector);
export const useSmartVisionChatReferenceLink = () => {
  const clearReference = () => {
    store.setState((draft) => {
      draft.reference = undefined;
    });
  };
  const useReference = useCallback((text: string) => {
    store.setState((draft) => {
      draft.reference = text;
    });
  }, []);

  return {
    clearReference,
    useReference,
  };
};
