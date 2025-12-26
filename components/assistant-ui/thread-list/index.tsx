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
      <SidebarContentPrimitive>
      {/* New Button */}
      <div className="mt-[var(--gap-lg)]">
        <ThreadListNew />
      </div>

      {/* Divider */}
      <SidebarDividerPrimitive />

      {/* Search */}
      <SidebarHistorySearchPrimitive>
        <SidebarHistorySearchContainer>
          <SidebarHistorySearchIcon>
            <Search className="size-4" />
          </SidebarHistorySearchIcon>
          <SidebarHistorySearchInput placeholder="搜索" />
        </SidebarHistorySearchContainer>
      </SidebarHistorySearchPrimitive>

      {/* History */}
      <SidebarHistoryPrimitive>
        <SidebarHistoryTitle>历史对话</SidebarHistoryTitle>

        {/* List */}
        <SidebarHistoryListPrimitive>
          <ThreadListItems />
          </SidebarHistoryListPrimitive>
        </SidebarHistoryPrimitive>
      </SidebarContentPrimitive>
    </ThreadListPrimitive.Root>
  );
};
