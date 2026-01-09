import { ComponentPropsWithoutRef, type ComponentRef, forwardRef } from "react";
import { Primitive } from "@radix-ui/react-primitive";
import { composeEventHandlers } from "@radix-ui/primitive";
import { useSmartVisionActionActions } from "@/runtime/smartVisionActionRuntime";
import { useSmartVisionConfigStore } from "@/runtime/smartVisionConfigRuntime";

type PrimitiveProps = ComponentPropsWithoutRef<typeof Primitive.button>;
export type Element = ComponentRef<typeof Primitive.button>;
export type Props = PrimitiveProps & {};
export const ActionBarPrimitiveWebSearch = forwardRef<Element, Props>(
  ({ onClick, ...props }, ref) => {
    const enableWebSearch = useSmartVisionConfigStore((s) => {
      return s.config?.enable_websearch;
    });
    const { onSwitchWebSearch } = useSmartVisionActionActions();
    if (enableWebSearch) {
      return (
        <Primitive.button
          type="button"
          {...props}
          ref={ref}
          onClick={composeEventHandlers(onClick, onSwitchWebSearch)}
        />
      );
    }
    return null;
  },
);
ActionBarPrimitiveWebSearch.displayName = "ActionBarPrimitiveWebSearch";
