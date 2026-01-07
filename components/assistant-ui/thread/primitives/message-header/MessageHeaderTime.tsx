import { ComponentPropsWithoutRef, type ComponentRef, forwardRef } from "react";
import { AvatarTime } from "@/components/wuhan/blocks/avatar-header-01";
import { useAssistantState } from "@assistant-ui/react";
import moment from "moment";

type PrimitiveProps = ComponentPropsWithoutRef<typeof AvatarTime>;
export type Element = ComponentRef<typeof AvatarTime>;
export type Props = PrimitiveProps & {
  format?: string;
};
export const MessageHeaderPrimitiveTime = forwardRef<Element, Props>(
  ({ format, ...props }, ref) => {
    const time = useAssistantState(({ message }) =>
      moment(message.createdAt).format(format || "M月D日 HH:mm"),
    );
    return (
      <AvatarTime ref={ref} {...props}>
        {time}
      </AvatarTime>
    );
  },
);

MessageHeaderPrimitiveTime.displayName = "MessageHeaderPrimitiveTime";
