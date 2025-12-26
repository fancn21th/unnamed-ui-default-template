import { ComponentPropsWithoutRef, type ComponentRef, forwardRef } from "react";
import { Primitive } from "@radix-ui/react-primitive";
import {
  useSmartVisionChatReferenceLink,
  useSmartVisionChatReferenceStore,
} from "@/runtime/smartVisionChatReferenceLink";
import { composeRefs } from "@radix-ui/react-compose-refs";

type PrimitiveDivProps = ComponentPropsWithoutRef<typeof Primitive.div>;
export type Element = ComponentRef<typeof Primitive.div>;
export type Props = PrimitiveDivProps & {};
export const ReferencePrimitiveActionBar = forwardRef<Element, Props>(
  ({ style, ...props }, forwardedRef) => {
    const referencePosition = useSmartVisionChatReferenceStore(
      (state) => state.reference?.position,
    );
    const { setActionBarRef } = useSmartVisionChatReferenceLink();
    const ref = composeRefs(forwardedRef, setActionBarRef);
    if (referencePosition) {
      return (
        <Primitive.div
          {...props}
          style={{
            ...style,
            position: "absolute",
            top: `${referencePosition.top}px`,
            left: `${referencePosition.left}px`,
          }}
          ref={ref}
        />
      );
    }
    return null;
  },
);

ReferencePrimitiveActionBar.displayName = "ReferencePrimitiveActionBar";
