import { ThreadListPrimitive } from "@assistant-ui/react";
import type { FC } from "react";
import { ThreadListNew } from "./ThreadListNew";
import { ThreadListItems } from "./ThreadListItems";

export const ThreadList: FC = () => {
  return (
    <ThreadListPrimitive.Root className="aui-root aui-thread-list-root flex flex-col items-stretch gap-1.5">
      <ThreadListNew />
      <ThreadListItems />
    </ThreadListPrimitive.Root>
  );
};
