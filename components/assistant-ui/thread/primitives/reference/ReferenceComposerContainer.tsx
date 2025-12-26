import { ComponentPropsWithoutRef, type ComponentRef, forwardRef } from "react";
import { Primitive } from "@radix-ui/react-primitive";
import { useSmartVisionChatReferenceStore } from "@/runtime/smartVisionChatReferenceLink";

type PrimitiveDivProps = ComponentPropsWithoutRef<typeof Primitive.div>;
export type Element = ComponentRef<typeof Primitive.div>;
export type Props = PrimitiveDivProps & {};
export const ReferencePrimitiveComposerContainer = forwardRef<Element, Props>(
  (props, ref) => {
    const text = useSmartVisionChatReferenceStore((s) => s.use);
    if (text) return <Primitive.div ref={ref} {...props} />;
    return null;
  },
);
ReferencePrimitiveComposerContainer.displayName =
  "ReferencePrimitiveComposerContainer";
