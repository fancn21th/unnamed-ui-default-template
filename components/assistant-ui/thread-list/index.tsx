import { ThreadListPrimitive } from "@assistant-ui/react";
import type { FC } from "react";
import {
  SidebarDividerPrimitive,
  SidebarHistoryPrimitive,
  SidebarHistoryTitle,
  SidebarHistoryListPrimitive,
  SidebarHistorySearchPrimitive,
  SidebarHistorySearchContainer,
  SidebarHistorySearchIcon,
  SidebarHistorySearchInput,
  SidebarContentPrimitive,
} from "@/components/wuhan/blocks/sidebar-01";
import { ThreadListNew } from "./ThreadListNew";
import { ThreadListItems } from "./ThreadListItems";
import { Search } from "lucide-react";
export const ThreadList: FC = () => {
  return (
    <ThreadListPrimitive.Root asChild>
      <SidebarContentPrimitive className="flex-1 min-h-0">
      {/* New Button */}
      <div className="shrink-0">
        <ThreadListNew />
      </div>

      {/* Divider */}
      <SidebarDividerPrimitive className="m-0 shrink-0"/>

      <div className="flex flex-col flex-1 min-h-0 gap-[var(--gap-lg)]">
        <SidebarHistoryTitle className="m-0 shrink-0">历史对话</SidebarHistoryTitle>

        {/* Search */}
        <SidebarHistorySearchPrimitive className="m-0 shrink-0">
          <SidebarHistorySearchContainer>
            <SidebarHistorySearchIcon>
              <Search className="size-4" />
            </SidebarHistorySearchIcon>
            <SidebarHistorySearchInput placeholder="搜索" />
          </SidebarHistorySearchContainer>
        </SidebarHistorySearchPrimitive>

        {/* History */}
        <SidebarHistoryPrimitive className="flex-1 min-h-0">

          {/* List */}
          <SidebarHistoryListPrimitive className="gap-[var(--gap-xs)]">
            <ThreadListItems />
          </SidebarHistoryListPrimitive>
        </SidebarHistoryPrimitive>
      </div>
      </SidebarContentPrimitive>
    </ThreadListPrimitive.Root>
  );
};
