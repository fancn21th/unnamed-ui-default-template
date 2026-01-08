import { ComponentPropsWithoutRef, type ComponentRef, forwardRef } from "react";
import { AvatarHeader } from "@/components/wuhan/blocks/avatar-header-01";

type PrimitiveProps = ComponentPropsWithoutRef<typeof AvatarHeader>;
export type Element = ComponentRef<typeof AvatarHeader>;
export type Props = PrimitiveProps & {};
export const MessageHeaderPrimitiveRoot = forwardRef<Element, Props>((props, ref) => {
  return <AvatarHeader ref={ref} {...props} />;
});

MessageHeaderPrimitiveRoot.displayName = "MessageHeaderRoot";
