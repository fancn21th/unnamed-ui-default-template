import { ComponentPropsWithoutRef, type ComponentRef, forwardRef } from "react";
import { Primitive } from "@radix-ui/react-primitive";
import { useSmartVisionChatReferenceLink } from "@/runtime/smartVisionChatReferenceLink";
import { composeEventHandlers } from "@radix-ui/primitive";

type PrimitiveDivProps = ComponentPropsWithoutRef<typeof Primitive.button>;
export type Element = ComponentRef<typeof Primitive.button>;
export type Props = PrimitiveDivProps & {};
export const ReferencePrimitiveUse = forwardRef<Element, Props>(
  ({ onClick, ...props }, ref) => {
    const { useReference } = useSmartVisionChatReferenceLink();
    return (
      <Primitive.button
        type="button"
        {...props}
        ref={ref}
        onClick={composeEventHandlers(onClick, useReference)}
      />
    );
  },
);
ReferencePrimitiveUse.displayName = "ReferencePrimitiveUse";
