import { ComponentPropsWithoutRef, type ComponentRef, forwardRef } from "react";
import { Primitive } from "@radix-ui/react-primitive";
import { useSmartVisionChatReferenceStore } from "@/runtime/smartVisionReferenceRuntime";

type PrimitiveProps = ComponentPropsWithoutRef<typeof Primitive.div>;
export type Element = ComponentRef<typeof Primitive.div>;
export type Props = PrimitiveProps & {};
export const ReferencePrimitiveComposerContainer = forwardRef<Element, Props>(
  (props, ref) => {
    const text = useSmartVisionChatReferenceStore((s) => s.reference);
    if (text) return <Primitive.div ref={ref} {...props} />;
    return null;
  },
);
ReferencePrimitiveComposerContainer.displayName =
  "ReferencePrimitiveComposerContainer";
