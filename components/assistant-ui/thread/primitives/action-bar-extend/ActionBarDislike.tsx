import { ComponentPropsWithoutRef, type ComponentRef, forwardRef } from "react";
import { Primitive } from "@radix-ui/react-primitive";
import { useSmartVisionActionActions } from "@/runtime/smartVisionActionRuntime";
import { composeEventHandlers } from "@radix-ui/primitive";
import { useDislikeFeedback } from "./DislikeFeedbackContext";

type PrimitiveProps = ComponentPropsWithoutRef<typeof Primitive.button>;
export type Element = ComponentRef<typeof Primitive.button>;
export type Props = PrimitiveProps & {};
export const ActionBarPrimitiveDislike = forwardRef<Element, Props>(
  ({ onClick, ...props }, ref) => {
    const { onDislike, queryLikeStatus } = useSmartVisionActionActions();
    const { openFeedback } = useDislikeFeedback();
    const result = queryLikeStatus({ dislike: true });
    if (result) {
      return (
        <Primitive.button
          type="button"
          {...props}
          ref={ref}
          onClick={composeEventHandlers(onClick, () => {
            onDislike();
          })}
        />
      );
    }
    return (
      <Primitive.button
        type="button"
        {...props}
        ref={ref}
        onClick={composeEventHandlers(onClick, () => {
          openFeedback();
        })}
      />
    );
  },
);
ActionBarPrimitiveDislike.displayName = "ActionBarPrimitiveDislike";
