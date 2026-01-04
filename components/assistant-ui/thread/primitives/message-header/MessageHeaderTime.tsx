import { ComponentPropsWithoutRef, type ComponentRef, forwardRef } from "react";
import { Primitive } from "@radix-ui/react-primitive";
import { useAssistantState } from "@assistant-ui/react";
import moment from "moment";

type PrimitiveProps = ComponentPropsWithoutRef<typeof Primitive.span>;
export type Element = ComponentRef<typeof Primitive.span>;
export type Props = PrimitiveProps & {
  format?: string;
};
export const MessageHeaderPrimitiveTime = forwardRef<Element, Props>(
  ({ format, ...props }, ref) => {
    const time = useAssistantState(({ message }) =>
      moment(message.createdAt).format(format || "M月D日 HH:mm"),
    );
    return (
      <Primitive.span ref={ref} {...props}>
        {time}
      </Primitive.span>
    );
  },
);

MessageHeaderPrimitiveTime.displayName = "MessageHeaderPrimitiveTime";
