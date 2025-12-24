import { MessagePrimitive } from "@assistant-ui/react";
import { FC } from "react";
import { UserMessage as WuhanUserMessage } from "@/components/wuhan/blocks/message-01";
import { UserMessageAttachments } from "../attachment";
import { BranchPicker } from "./BranchPicker";
import { UserActionBar } from "./UserActionBar";

export const UserMessage: FC = () => {
  return (
    <MessagePrimitive.Root asChild>
      <div
        className="aui-user-message-root mx-auto grid w-full max-w-[var(--thread-max-width)] animate-in auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] gap-y-2 px-2 py-4 duration-150 ease-out fade-in slide-in-from-bottom-1 first:mt-3 last:mb-5 [&:where(>*)]:col-start-2"
        data-role="user"
      >
        <UserMessageAttachments />

        <div className="aui-user-message-content-wrapper relative col-start-2 min-w-0">
          <WuhanUserMessage className="aui-user-message-content break-words">
            <MessagePrimitive.Parts />
          </WuhanUserMessage>
          <div className="absolute top-full right-0 z-10 mt-2">
            <UserActionBar />
          </div>
        </div>

        <BranchPicker className="aui-user-branch-picker col-span-full col-start-1 row-start-3 -mr-1 justify-end" />
      </div>
    </MessagePrimitive.Root>
  );
};
