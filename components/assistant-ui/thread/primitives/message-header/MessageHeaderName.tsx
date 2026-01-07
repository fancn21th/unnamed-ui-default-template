import { ComponentPropsWithoutRef, type ComponentRef, forwardRef } from "react";
import { AvatarName } from "@/components/wuhan/blocks/avatar-header-01";

type PrimitiveProps = ComponentPropsWithoutRef<typeof AvatarName>;
export type Element = ComponentRef<typeof AvatarName>;
export type Props = PrimitiveProps & {};
export const MessageHeaderPrimitiveName = forwardRef<Element, Props>((props, ref) => {
  return <AvatarName ref={ref} {...props} />;
});

MessageHeaderPrimitiveName.displayName = "MessageHeaderPrimitiveName";
