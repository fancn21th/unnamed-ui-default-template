import { ComponentPropsWithoutRef, type ComponentRef, forwardRef } from "react";
import { Primitive } from "@radix-ui/react-primitive";
import { composeEventHandlers } from "@radix-ui/primitive";
import {
  useSmartVisionMessageActionActions,
} from "@/runtime/smartVisionActionRuntime";

type PrimitiveProps = ComponentPropsWithoutRef<typeof Primitive.button>;
export type Element = ComponentRef<typeof Primitive.button>;
export type Props = PrimitiveProps & {};
export const ActionBarPrimitiveLike = forwardRef<Element, Props>(
  ({ onClick, ...props }, ref) => {
    const { onLike } = useSmartVisionMessageActionActions();
    return (
      <Primitive.button
        type="button"
        {...props}
        ref={ref}
        onClick={composeEventHandlers(onClick, onLike)}
      />
    );
  },
);
ActionBarPrimitiveLike.displayName = "ActionBarPrimitiveLike";
