import { ComponentPropsWithoutRef, type ComponentRef, forwardRef } from "react";
import { Primitive } from "@radix-ui/react-primitive";

type PrimitiveDivProps = ComponentPropsWithoutRef<typeof Primitive.div>;
export type Element = ComponentRef<typeof Primitive.div>;
export type Props = PrimitiveDivProps & {};
export const ReferencePrimitiveActionBar = forwardRef<Element, Props>(
  (props, ref) => {
    return <Primitive.div {...props} ref={ref} />;
  },
);
