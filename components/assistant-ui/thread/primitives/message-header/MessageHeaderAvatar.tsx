import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSmartVisionConfigStore } from "@/runtime/smartVisionConfigRuntime";
import {
  ComponentPropsWithoutRef,
  type ComponentRef,
  forwardRef,
} from "react";
import { Primitive } from "@radix-ui/react-primitive";
import { cn } from "@/lib/utils";

type PrimitiveProps = ComponentPropsWithoutRef<typeof Primitive.div>;
export type Element = ComponentRef<typeof Primitive.div>;
export type Props = PrimitiveProps & {};
export const MessageHeaderPrimitiveAvatar = forwardRef<Element, Props>(
  ({ className, ...props }, ref) => {
    const src = useSmartVisionConfigStore((s) => {
      if (s.config?.avatar) {
        return s.config?.avatar;
      }
      const logoData = s.appConfig?.app_icon?.condensedLogoUrl;
      return logoData?.status ? logoData.logoUrl : "";
    });
    return (
      <Avatar className="message-header-avatar">
        <AvatarImage
          src={src}
          alt="message header avatar"
          className="message-header-image object-cover"
        />
        <AvatarFallback delayMs={200}>
          <Primitive.div
            ref={ref}
            {...props}
            className={cn(
              "message-header-fallback-icon size-8 text-muted-foreground",
              className,
            )}
          />
        </AvatarFallback>
      </Avatar>
    );
  },
);

MessageHeaderPrimitiveAvatar.displayName = "MessageHeaderPrimitiveAvatar";
