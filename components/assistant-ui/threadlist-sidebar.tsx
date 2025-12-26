import * as React from "react";
import { Sparkles, User, Plus } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { ThreadListPrimitive } from "@assistant-ui/react";
import { cn } from "@/lib/utils";

export function ThreadListSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar 
      {...props} 
      collapsible="icon" 
      className="border-none"
      style={{
        "--sidebar-width-icon": "56px",
        ...props.style,
      } as React.CSSProperties}
    >
      <SidebarPrimitive className={cn(
        "shrink-0 w-full opacity-100 bg-[var(--bg-page-neutral)] overflow-hidden transition-all duration-200",
        isCollapsed ? "p-2 bg-[var(--background)]" : "p-[var(--padding-com-lg)]"
      )}>
        <SidebarContentPrimitive>
          {/* Header */}
          <SidebarHeaderPrimitive className={cn(
            isCollapsed && "flex-col gap-2 items-center justify-start"
          )}>
            {isCollapsed ? (
              <>
                {/* Collapsed: Only show two icons */}
                <SidebarHeaderAction className="w-full flex justify-center">
                  <SidebarTrigger />
                </SidebarHeaderAction>
                <ThreadListPrimitive.New asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                  >
                    <Plus className="size-4" />
                  </Button>
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
                  <SidebarTrigger />
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
