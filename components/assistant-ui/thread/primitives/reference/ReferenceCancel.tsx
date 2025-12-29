import { ComponentPropsWithoutRef, type ComponentRef, forwardRef } from "react";
import { Primitive } from "@radix-ui/react-primitive";
import { useSmartVisionChatReferenceActions } from "@/runtime/smartVisionReferenceRuntime";

type PrimitiveProps = ComponentPropsWithoutRef<typeof Primitive.button>;
export type Element = ComponentRef<typeof Primitive.button>;
export type Props = PrimitiveProps & {};
export const ReferencePrimitiveCancel = forwardRef<Element, Props>(
  ({ onClick, ...props }, ref) => {
    const { clearReference } = useSmartVisionChatReferenceActions();
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
