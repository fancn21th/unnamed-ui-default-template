import {
  ComponentPropsWithoutRef,
  type ComponentRef,
  forwardRef,
  useEffect,
  useRef,
} from "react";
import { Primitive } from "@radix-ui/react-primitive";
import { useSmartVisionChatReferenceLink } from "@/runtime/smartVisionChatReferenceLink";
import { useComposedRefs } from "@radix-ui/react-compose-refs";

type PrimitiveDivProps = ComponentPropsWithoutRef<typeof Primitive.div>;
export type Element = ComponentRef<typeof Primitive.div>;
export type Props = PrimitiveDivProps & {};
export const ReferencePrimitiveRoot = forwardRef<Element, Props>(
  (props, forwardedRef) => {
    const localRef = useRef<HTMLDivElement>(null);
    const ref = useComposedRefs(forwardedRef, localRef);
    const { chooseReference, clearReference } =
      useSmartVisionChatReferenceLink();

    useEffect(() => {
      const contentNode = localRef.current;
      const handleMouseUp = () => {
        const selection = window.getSelection();
        const selectText = selection?.toString(); // 获取当前选中的文本
        if (
          selection &&
          selectText &&
          selectText.length > 0 &&
          contentNode?.contains(selection.anchorNode)
        ) {
          // 定位
          const range = selection.getRangeAt(0).getBoundingClientRect();
          const componentRect = localRef.current?.getBoundingClientRect() ?? {
            top: 0,
            left: 0,
          };

          const top = range.top - componentRect.top - 28; // 20px above the selected text
          const left = range.left - componentRect.left;
          chooseReference(selectText, { top, left });
        } else {
          clearReference(false);
        }
      };

      document.addEventListener("selectionchange", handleMouseUp);
      return () => {
        document.removeEventListener("selectionchange", handleMouseUp);
        clearReference();
      };
    }, []);
    return <Primitive.div {...props} ref={ref} />;
  },
);
