import { ThreadListItemPrimitive } from "@assistant-ui/react";
import type { FC } from "react";

export const ThreadListItemTitle: FC = () => {
  return (
    <ThreadListItemPrimitive.Title fallback="新建对话" />
  );
};
