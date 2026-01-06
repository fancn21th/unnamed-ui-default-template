import * as React from "react";
import { Sparkles, User, SquarePlus } from "lucide-react";
import {
  Sidebar,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  SidebarPrimitive,
  SidebarContentPrimitive,
  SidebarHeaderPrimitive,
  SidebarHeaderLeading,
  SidebarHeaderIcon,
  SidebarHeaderTitle,
  SidebarHeaderAction,
  SidebarFooterPrimitive,
} from "@/components/wuhan/blocks/sidebar-01";
import { ThreadList } from "@/components/assistant-ui/thread-list";
import { ThreadListPrimitive } from "@assistant-ui/react";
import { cn } from "@/lib/utils";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";

export function ThreadListSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar 
      {...props} 
      collapsible="icon" 
      className="border-none group-data-[state=collapsed]:border-r"
      style={{
        "--sidebar-width-icon": "56px",
        ...props.style,
      } as React.CSSProperties}
    >
      <SidebarPrimitive 
        className={cn(
          "shrink-0 w-full opacity-100 bg-[var(--bg-page-secondary)] overflow-hidden transition-all duration-200",
          isCollapsed ? "p-2 bg-[var(--background)] border-r" : "p-[var(--padding-com-lg)]"
        )}
        style={isCollapsed ? { borderColor: "var(--border-neutral)", borderRightWidth: "1px" } : undefined}
      >
        <SidebarContentPrimitive className="flex-1 min-h-0">
          {/* Header */}
          <SidebarHeaderPrimitive className={cn(
            "shrink-0",
            isCollapsed && "flex-col gap-2 items-center justify-start"
          )}>
            {isCollapsed ? (
              <>
                {/* Collapsed: Only show two icons */}
                <SidebarHeaderAction className="w-full flex justify-center">
                <TooltipIconButton
                    tooltip="展开侧边栏"
                    asChild
                  >
                    <SidebarTrigger className="size-8 rounded-[var(--radius-lg)] hover:bg-[var(--bg-neutral-light)]" />
                  </TooltipIconButton>
                </SidebarHeaderAction>
                <ThreadListPrimitive.New asChild>
                  <TooltipIconButton
                    tooltip="新对话"
                    size="icon"
                    className="size-8 rounded-[var(--radius-lg)] hover:bg-[var(--bg-neutral-light)]"
                  >
                    <SquarePlus className="size-4" />
                  </TooltipIconButton>
                </ThreadListPrimitive.New>
              </>
            ) : (
              <>
                <SidebarHeaderLeading>
                  <SidebarHeaderIcon aria-hidden="true">
                    <Sparkles className="size-4" />
                  </SidebarHeaderIcon>
                  <SidebarHeaderTitle>问学</SidebarHeaderTitle>
                </SidebarHeaderLeading>
                <SidebarHeaderAction>
                  <TooltipIconButton
                    tooltip="收起侧边栏"
                    asChild
                  >
                    <SidebarTrigger className="size-8 rounded-[var(--radius-lg)] hover:bg-[var(--bg-neutral-light)]" />
                  </TooltipIconButton>
                </SidebarHeaderAction>
              </>
            )}
          </SidebarHeaderPrimitive>

          {/* Thread List - Hidden when collapsed */}
          {!isCollapsed && <ThreadList />}
        </SidebarContentPrimitive>

        {/* Footer */}
        <SidebarFooterPrimitive>
          <SidebarHeaderLeading className={cn(
            isCollapsed && "justify-center w-full"
          )}>
            <SidebarHeaderIcon className="rounded-full">
              <User className="size-4" />
            </SidebarHeaderIcon>
            {!isCollapsed && (
              <SidebarHeaderTitle>
                User
              </SidebarHeaderTitle>
            )}
          </SidebarHeaderLeading>
        </SidebarFooterPrimitive>
      </SidebarPrimitive>
    </Sidebar>
  );
}
