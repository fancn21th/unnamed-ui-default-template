import { ComponentPropsWithoutRef, type ComponentRef, forwardRef } from "react";
import { Primitive } from "@radix-ui/react-primitive";

type PrimitiveProps = ComponentPropsWithoutRef<typeof Primitive.span>;
export type Element = ComponentRef<typeof Primitive.span>;
export type Props = PrimitiveProps & {};
export const MessageHeaderPrimitiveName = forwardRef<Element, Props>((props, ref) => {
  return <Primitive.span ref={ref} {...props} />;
});

MessageHeaderPrimitiveName.displayName = "MessageHeaderPrimitiveName";
