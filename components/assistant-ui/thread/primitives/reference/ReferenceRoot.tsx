import {
  ComponentPropsWithoutRef,
  type ComponentRef,
  forwardRef,
  useEffect,
  useRef,
} from "react";
import { Primitive } from "@radix-ui/react-primitive";
import {
  ReferenceProvider,
  useReferenceProviderContext,
} from "@/runtime/smartVisionReferenceRuntime";
import { useComposedRefs } from "@radix-ui/react-compose-refs";

type PrimitiveProps = ComponentPropsWithoutRef<typeof Primitive.div>;
export type Element = ComponentRef<typeof Primitive.div>;
export type Props = PrimitiveProps & {};
const ReferenceRoot = forwardRef<Element, Props>((props, forwardedRef) => {
  const localRef = useRef<HTMLDivElement>(null);
  const ref = useComposedRefs(forwardedRef, localRef);
  const { onChoose, onClear } = useReferenceProviderContext();

  useEffect(() => {
    const contentNode = localRef.current;
    const onSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection) return;
      if (!contentNode) return;
      const selectText = selection.toString(); // 获取当前选中的文本
      if (selectText) {
        /* 选中了文本 */
        if (contentNode.contains(selection.anchorNode)) {
          /* 范围内 */
          const range = getSelectionStartRect(selection);
          const componentRect = localRef.current?.getBoundingClientRect() ?? {
            top: 0,
            left: 0,
          };

          const top = range.top - componentRect.top - 24; // 24px above the selected text
          const left = range.left - componentRect.left;
          onChoose?.(selectText, { top, left });
        }
      } else {
        /* 未选中文本 */
        onClear?.();
      }
    };

    document.addEventListener("selectionchange", onSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", onSelectionChange);
    };
  }, [onChoose, onClear]);
  return <Primitive.div {...props} ref={ref} />;
});
ReferenceRoot.displayName = "ReferenceRoot";
export const ReferencePrimitiveRoot = forwardRef<Element, Props>(
  (props, forwardedRef) => {
    return (
      <ReferenceProvider>
        <ReferenceRoot {...props} ref={forwardedRef} />
      </ReferenceProvider>
    );
  },
);
ReferencePrimitiveRoot.displayName = "ReferencePrimitiveRoot";

const getSelectionStartRect = (selection:Selection) => {

  const range = selection.getRangeAt(0).cloneRange(); // 克隆避免修改原选区

  // 折叠 Range 到起始点（长度为0）
  range.collapse(true); // true 表示折叠到起点

  // 创建一个临时 span 元素插入到该位置，以获取精确位置
  const tempSpan = document.createElement("span");
  tempSpan.textContent = "\u200B"; // 零宽字符，不影响布局
  range.insertNode(tempSpan);

  const rect = tempSpan.getBoundingClientRect();

  // 清理临时元素
  tempSpan.parentNode?.removeChild(tempSpan);

  return rect;
};
