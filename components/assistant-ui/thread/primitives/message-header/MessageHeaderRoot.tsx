import { ComponentPropsWithoutRef, type ComponentRef, forwardRef } from "react";
import { Primitive } from "@radix-ui/react-primitive";

type PrimitiveProps = ComponentPropsWithoutRef<typeof Primitive.div>;
export type Element = ComponentRef<typeof Primitive.div>;
export type Props = PrimitiveProps & {};
export const MessageHeaderPrimitiveRoot = forwardRef<Element, Props>((props, ref) => {
  return <Primitive.div ref={ref} {...props} />;
});

MessageHeaderPrimitiveRoot.displayName = "MessageHeaderRoot";
