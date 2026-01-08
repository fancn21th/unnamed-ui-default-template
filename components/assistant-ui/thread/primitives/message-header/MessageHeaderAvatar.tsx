import { Avatar as UIAvatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Avatar } from "@/components/wuhan/blocks/avatar-header-01";
import { useSmartVisionConfigStore } from "@/runtime/smartVisionConfigRuntime";
import {
  ComponentPropsWithoutRef,
  type ComponentRef,
  forwardRef,
} from "react";
import { cn } from "@/lib/utils";

type PrimitiveProps = ComponentPropsWithoutRef<typeof Avatar>;
export type Element = ComponentRef<typeof Avatar>;
export type Props = PrimitiveProps & {};
export const MessageHeaderPrimitiveAvatar = forwardRef<Element, Props>(
  ({ className, children, ...props }, ref) => {
    const src = useSmartVisionConfigStore((s) => {
      if (s.config?.avatar) {
        return s.config?.avatar;
      }
      const logoData = s.appConfig?.app_icon?.condensedLogoUrl;
      return logoData?.status ? logoData.logoUrl : "";
    });
    
    // 如果有配置的头像图片，使用 UI Avatar 组件显示图片
    if (src) {
      return (
        <UIAvatar className="message-header-avatar">
          <AvatarImage
            src={src}
            alt="message header avatar"
            className="message-header-image object-cover"
          />
          <AvatarFallback delayMs={200}>
            <Avatar
              ref={ref}
              {...props}
              className={cn(className)}
            >
              {children}
            </Avatar>
          </AvatarFallback>
        </UIAvatar>
      );
    }
    
    // 如果没有配置头像，直接使用 Avatar 原语样式
    return (
      <Avatar
        ref={ref}
        {...props}
        className={cn(className)}
      >
        {children}
      </Avatar>
    );
  },
);

MessageHeaderPrimitiveAvatar.displayName = "MessageHeaderPrimitiveAvatar";
