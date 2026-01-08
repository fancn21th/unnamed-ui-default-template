import { MessagePrimitive } from "@assistant-ui/react";
import type { FC } from "react";
import { UserMessage as WuhanUserMessage } from "@/components/wuhan/blocks/message-01";
import { UserMessageAttachments } from "../attachment";
import { BranchPicker } from "./BranchPicker";
import { UserActionBar } from "./UserActionBar";
import { MessageHeader } from "./primitives/message-header";
import { UserRound } from "lucide-react";
export const UserMessage: FC = () => {
  return (
    <MessagePrimitive.Root asChild>
      <div
        className="aui-user-message-root group/user-message mx-auto flex flex-col w-full max-w-[var(--thread-max-width)] animate-in auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] gap-y-2 py-4 duration-150 ease-out fade-in slide-in-from-bottom-1 first:mt-3 last:mb-5"
        data-role="user"
      >
        {/* MessageHeader 显示在顶部，左对齐 */}
        <div className="flex justify-end">
          <MessageHeader.Root>
            <MessageHeader.Avatar className="flex items-center justify-center">
              <UserRound className="size-4" />
            </MessageHeader.Avatar>
            <MessageHeader.Name>User</MessageHeader.Name>
            <MessageHeader.Time />
          </MessageHeader.Root>
        </div>
        {/* 附件内容，右对齐 */}
        <UserMessageAttachments />

        {/* 消息内容，右对齐 */}
        <div className="aui-user-message-content-wrapper relative col-start-2 row-start-3 min-w-0 flex justify-end">
          <WuhanUserMessage className="aui-user-message-content  break-words">
            <MessagePrimitive.Parts />
          </WuhanUserMessage>
          <div className="absolute top-full right-0 z-10 mt-2 opacity-0 pointer-events-none group-hover/user-message:opacity-100 group-hover/user-message:pointer-events-auto transition-opacity">
            <UserActionBar />
          </div>
        </div>

        <BranchPicker className="aui-user-branch-picker col-span-full col-start-1 row-start-4 -mr-1 justify-end" />
      </div>
    </MessagePrimitive.Root>
  );
};
