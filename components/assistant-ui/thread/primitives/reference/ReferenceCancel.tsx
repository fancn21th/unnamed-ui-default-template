import { ComponentPropsWithoutRef, type ComponentRef, forwardRef } from "react";
import { Primitive } from "@radix-ui/react-primitive";
import { useSmartVisionChatReferenceLink } from "@/runtime/smartVisionChatReferenceLink";

type PrimitiveDivProps = ComponentPropsWithoutRef<typeof Primitive.button>;
export type Element = ComponentRef<typeof Primitive.button>;
export type Props = PrimitiveDivProps & {};
export const ReferencePrimitiveCancel = forwardRef<Element, Props>(
  ({ onClick, ...props }, ref) => {
    const { clearReference } = useSmartVisionChatReferenceLink();
    return (
      <Primitive.button
        type="button"
        {...props}
        ref={ref}
        onClick={(e) => {
          onClick?.(e);
          clearReference();
        }}
      />
    );
  },
);
ReferencePrimitiveCancel.displayName = "ReferencePrimitiveCancel";
