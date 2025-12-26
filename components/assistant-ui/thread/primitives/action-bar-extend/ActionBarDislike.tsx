import { ComponentPropsWithoutRef, type ComponentRef, forwardRef } from "react";
import { Primitive } from "@radix-ui/react-primitive";
import { composeEventHandlers } from "@radix-ui/primitive";
import { useSmartVisionActionLink } from "@/runtime/smartVisionActionLink";

type PrimitiveProps = ComponentPropsWithoutRef<typeof Primitive.button>;
export type Element = ComponentRef<typeof Primitive.button>;
export type Props = PrimitiveProps & {};
export const ActionBarPrimitiveDislike = forwardRef<Element, Props>(
  ({ onClick, ...props }, ref) => {
    const { onDislike } = useSmartVisionActionLink();
    return (
      <Primitive.button
        type="button"
        {...props}
        ref={ref}
        onClick={composeEventHandlers(onClick, onDislike)}
      />
    );
  },
);
ActionBarPrimitiveDislike.displayName = "ActionBarPrimitiveDislike";
