import type { FC } from "react";
import { ThreadListPrimitive, useAssistantState } from "@assistant-ui/react";
import { ThreadListSkeleton } from "./ThreadListSkeleton";
import { ThreadListItem } from "./ThreadListItem";

export const ThreadListItems: FC = () => {
  const isLoading = useAssistantState(({ threads }) => threads.isLoading);

  if (isLoading) {
    return <ThreadListSkeleton />;
  }

  return <ThreadListPrimitive.Items components={{ ThreadListItem }} />;
};