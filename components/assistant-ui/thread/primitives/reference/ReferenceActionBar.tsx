import { ComponentPropsWithoutRef, type ComponentRef, forwardRef } from "react";
import { Primitive } from "@radix-ui/react-primitive";
import { useReferenceProviderContext } from "@/runtime/smartVisionReferenceRuntime";

type PrimitiveProps = ComponentPropsWithoutRef<typeof Primitive.div>;
export type Element = ComponentRef<typeof Primitive.div>;
export type Props = PrimitiveProps & {};
export const ReferencePrimitiveActionBar = forwardRef<Element, Props>(
  ({ style, ...props }, forwardedRef) => {
    const { reference } = useReferenceProviderContext();

    if (reference?.position) {
      return (
        <Primitive.div
          {...props}
          style={{
            ...style,
            position: "absolute",
            top: `${reference.position.top}px`,
            left: `${reference.position.left}px`,
          }}
          ref={forwardedRef}
        />
      );
    }
    return null;
  },
);

ReferencePrimitiveActionBar.displayName = "ReferencePrimitiveActionBar";
