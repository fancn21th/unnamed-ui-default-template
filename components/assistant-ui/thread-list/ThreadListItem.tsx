import type { FC } from "react";
import { useState } from "react";
import { ThreadListItemPrimitive } from "@assistant-ui/react";
import {
  HistoryItemPrimitive,
  HistoryItemTitlePrimitive,
  HistoryItemHoverTrailingPrimitive,
} from "@/components/wuhan/blocks/history-item-01";
import { ThreadListItemActions } from "./ThreadListItemActions";

export const ThreadListItem: FC = () => {
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <ThreadListItemPrimitive.Root asChild className="aui-thread-list-item cursor-pointer">
      <ThreadListItemPrimitive.Trigger asChild>
        <HistoryItemPrimitive asChild data-active={moreOpen ? "true" : undefined}>
          <div>
            <HistoryItemTitlePrimitive>
              <ThreadListItemPrimitive.Title fallback="新建对话" />
            </HistoryItemTitlePrimitive>
            <HistoryItemHoverTrailingPrimitive
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <ThreadListItemActions onOpenChange={setMoreOpen} />
            </HistoryItemHoverTrailingPrimitive>
          </div>
        </HistoryItemPrimitive>
      </ThreadListItemPrimitive.Trigger>
    </ThreadListItemPrimitive.Root>
  );
};