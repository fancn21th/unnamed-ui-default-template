import type { FC } from "react";
import { ThreadListItemPrimitive } from "@assistant-ui/react";
import {
  HistoryItemPrimitive,
  HistoryItemTitlePrimitive,
  HistoryItemHoverTrailingPrimitive,
} from "@/components/wuhan/blocks/history-item-01";
import { ThreadListItemArchive } from "./ThreadListItemArchive";

export const ThreadListItem: FC = () => {
  return (
    <ThreadListItemPrimitive.Root asChild className="aui-thread-list-item">
      <ThreadListItemPrimitive.Trigger asChild>
        <HistoryItemPrimitive>
          <HistoryItemTitlePrimitive>
            <ThreadListItemPrimitive.Title fallback="新建对话" />
          </HistoryItemTitlePrimitive>
          <HistoryItemHoverTrailingPrimitive>
            <ThreadListItemArchive />
          </HistoryItemHoverTrailingPrimitive>
        </HistoryItemPrimitive>
      </ThreadListItemPrimitive.Trigger>
    </ThreadListItemPrimitive.Root>
  );
};