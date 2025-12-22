import { ThreadListItemPrimitive } from "@assistant-ui/react";
import { FC } from "react";

export const ThreadListItemTitle: FC = () => {
  return (
    <span className="aui-thread-list-item-title text-sm">
      <ThreadListItemPrimitive.Title fallback="New Chat" />
    </span>
  );
};
