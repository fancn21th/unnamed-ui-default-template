"use client";

import * as React from "react";
import { Ellipsis, Share2, FileEdit, Trash2, LucideIcon } from "lucide-react";
import { ThreadListItemPrimitive } from "@assistant-ui/react";
import { cn } from "@/lib/utils";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

// 公共按钮样式
const actionButtonClassName = cn(
    "h-8",
    "gap-[var(--gap-xs)]",
    "rounded-[var(--radius-sm)]",
    "pt-[var(--padding-com-xs)] pb-[var(--padding-com-xs)] pl-[var(--padding-com-md)] pr-[var(--padding-com-md)]",
    "hover:bg-[var(--bg-neutral-light)]",
    "font-[var(--font-family-cn)]",
    "font-[var(--font-weight-400)]",
    "text-sm",
    "leading-[var(--line-height-2)]",
    "tracking-[0px]",
    "flex items-center",
    "cursor-pointer",
    "justify-start"
);

// 按钮配置
interface ActionButtonConfig {
    label: string;
    icon: LucideIcon;
    textColor?: string;
    onClick?: () => void;
    wrapper?: (children: React.ReactNode) => React.ReactNode;
}

function HoverMorePopover({
    open,
    onOpenChange,
    children,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}) {
    const closeTimer = React.useRef<number | null>(null);

    const clearCloseTimer = () => {
        if (closeTimer.current != null) {
            window.clearTimeout(closeTimer.current);
            closeTimer.current = null;
        }
    };

    const scheduleClose = () => {
        clearCloseTimer();
        closeTimer.current = window.setTimeout(() => onOpenChange(false), 120);
    };

    React.useEffect(() => {
        return () => clearCloseTimer();
    }, []);

    const actionButtons: ActionButtonConfig[] = [
        {
            label: "分享",
            icon: Share2,
            textColor: "text-[var(--text-primary)]",
            onClick: () => {
                // TODO: 实现分享功能
            },
        },
        {
            label: "重命名",
            icon: FileEdit,
            textColor: "text-[var(--text-primary)]",
            onClick: () => {
                // TODO: 实现重命名功能
            },
        },
        {
            label: "删除",
            icon: Trash2,
            textColor: "text-[var(--text-error)]",
            wrapper: (children) => (
                <ThreadListItemPrimitive.Delete asChild>
                    {children}
                </ThreadListItemPrimitive.Delete>
            ),
        },
    ];

    return (
        <Popover open={open} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
                <span
                    className="inline-flex items-center"
                    onMouseEnter={() => {
                        clearCloseTimer();
                        onOpenChange(true);
                    }}
                    onMouseLeave={() => {
                        scheduleClose();
                    }}
                >
                    {children}
                </span>
            </PopoverTrigger>
            <PopoverContent
                side="bottom"
                align="start"
                sideOffset={8}
                onMouseEnter={() => {
                    clearCloseTimer();
                    onOpenChange(true);
                }}
                onMouseLeave={() => {
                    scheduleClose();
                }}
                className={cn(
                    "z-50",
                    "w-[88px]",
                    "rounded-[var(--radius-md)]",
                    "border border-[var(--border-neutral)]",
                    "bg-[var(--bg-container)]",
                    "shadow-[var(--shadow-basic)]",
                    "p-[var(--gap-xs)]",
                )}
            >
                <div className="flex flex-col gap-1">
                    {actionButtons.map(({ label, icon: Icon, textColor, onClick, wrapper }) => {
                        const button = (
                            <button
                                key={label}
                                type="button"
                                className={cn(actionButtonClassName, textColor)}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onClick?.();
                                }}
                            >
                                <Icon className={cn("size-4", textColor)} />
                                <span>{label}</span>
                            </button>
                        );

                        return wrapper ? (
                            <React.Fragment key={label}>{wrapper(button)}</React.Fragment>
                        ) : (
                            button
                        );
                    })}
                </div>
            </PopoverContent>
        </Popover>
    );
}

export const ThreadListItemActions: React.FC<{
    onOpenChange?: (open: boolean) => void;
}> = ({ onOpenChange }) => {
    const [moreOpen, setMoreOpen] = React.useState(false);

    const handleOpenChange = (open: boolean) => {
        setMoreOpen(open);
        onOpenChange?.(open);
    };

    return (
        <HoverMorePopover open={moreOpen} onOpenChange={handleOpenChange}>
            <span className="inline-flex items-center" aria-label="更多操作">
                <Ellipsis className="size-4" />
            </span>
        </HoverMorePopover>
    );
};

