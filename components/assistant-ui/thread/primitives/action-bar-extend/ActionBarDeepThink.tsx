import { ComponentPropsWithoutRef, type ComponentRef, forwardRef } from "react";
import { Primitive } from "@radix-ui/react-primitive";
import { composeEventHandlers } from "@radix-ui/primitive";
import { useSmartVisionActionActions } from "@/runtime/smartVisionActionRuntime";
import { useSmartVisionConfigStore } from "@/runtime/smartVisionConfigRuntime";

type PrimitiveProps = ComponentPropsWithoutRef<typeof Primitive.button>;
export type Element = ComponentRef<typeof Primitive.button>;
export type Props = PrimitiveProps & {};
export const ActionBarPrimitiveDeepThink = forwardRef<Element, Props>(
  ({ onClick, ...props }, ref) => {
    const enableDeepThink = useSmartVisionConfigStore((s) => {
      return s.config?.model?.is_mix_think;
    });
    const { onSwitchDeepThink } = useSmartVisionActionActions();
    if (enableDeepThink) {
      return (
        <Primitive.button
          type="button"
          {...props}
          ref={ref}
          onClick={composeEventHandlers(onClick, onSwitchDeepThink)}
        />
      );
    }
    return null;
  },
);
ActionBarPrimitiveDeepThink.displayName = "ActionBarPrimitiveDeepThink";
