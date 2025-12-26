import { ComponentPropsWithoutRef, type ComponentRef, forwardRef } from "react";
import { Primitive } from "@radix-ui/react-primitive";
import {
  useReferenceProviderContext,
  useSmartVisionChatReferenceLink,
} from "@/runtime/smartVisionReferenceRuntime";
import { composeEventHandlers } from "@radix-ui/primitive";

type PrimitiveProps = ComponentPropsWithoutRef<typeof Primitive.button>;
export type Element = ComponentRef<typeof Primitive.button>;
export type Props = PrimitiveProps & {};
export const ReferencePrimitiveUse = forwardRef<Element, Props>(
  ({ onClick, ...props }, ref) => {
    const { reference, onClear } = useReferenceProviderContext();
    const { useReference } = useSmartVisionChatReferenceLink();
    const onUseReference = () => {
      if (reference) useReference(reference.text);
      onClear?.();
      window.getSelection()?.removeAllRanges();
    };
    return (
      <Primitive.button
        type="button"
        {...props}
        ref={ref}
        onClick={composeEventHandlers(onClick, onUseReference)}
      />
    );
  },
);
ReferencePrimitiveUse.displayName = "ReferencePrimitiveUse";
