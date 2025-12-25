import {
  ComponentPropsWithoutRef,
  type ComponentRef,
  forwardRef,
  useEffect,
  useRef,
} from "react";
import { Primitive } from "@radix-ui/react-primitive";
import { useSmartVisionChatReferenceLink } from "@/runtime/smartVisionChatReferenceLink";


type PrimitiveDivProps = ComponentPropsWithoutRef<typeof Primitive.div>;
export type Element = ComponentRef<typeof Primitive.div>;
export type Props = PrimitiveDivProps & {};
export const ReferencePrimitiveRoot = forwardRef<Element, Props>(
  (props, forwardedRef) => {
    const localRef = useRef<HTMLDivElement>(null);
    const { chooseReference, clearReference } =
      useSmartVisionChatReferenceLink();

    // 合并 forwardedRef 和 internalRef
    useEffect(() => {
      if (typeof forwardedRef === "function") {
        forwardedRef(localRef.current);
      } else if (forwardedRef) {
        forwardedRef.current = localRef.current;
      }
    }, [localRef.current]);
    useEffect(() => {
      const contentNode = localRef.current;
      const handleMouseUp = () => {
        const selection = window.getSelection();
        const selectText = selection && selection?.toString(); // 获取当前选中的文本

        if (
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
        }
      };
      // 监听页面其余地方取消选中清空
      const handleMouseDown = (event: any) => {
        // 确保点击图标时不会隐藏图标
        clearReference();
      };

      contentNode?.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("mousedown", handleMouseDown);
      return () => {
        contentNode?.removeEventListener("mouseup", handleMouseUp);
        document.addEventListener("mousedown", handleMouseDown);
        clearReference();
      };
    }, []);
    return <Primitive.div {...props} ref={localRef} />;
  },
);
