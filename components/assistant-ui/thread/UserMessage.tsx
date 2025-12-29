import { MessagePrimitive } from "@assistant-ui/react";
import type { FC } from "react";
import { UserMessage as WuhanUserMessage } from "@/components/wuhan/blocks/message-01";
import { UserMessageAttachments } from "../attachment";
import { BranchPicker } from "./BranchPicker";
import { UserActionBar } from "./UserActionBar";
import { MessageAvatarHeader } from "@/components/wuhan/blocks/avatar-header-01";
export const UserMessage: FC = () => {
  return (
    <MessagePrimitive.Root asChild>
      <div
        className="aui-user-message-root mx-auto grid w-full max-w-[var(--thread-max-width)] animate-in auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] gap-y-2 px-2 py-4 duration-150 ease-out fade-in slide-in-from-bottom-1 first:mt-3 last:mb-5"
        data-role="user"
      >
        {/* MessageAvatarHeader 显示在顶部，右对齐 */}
        <div className="col-start-2 row-start-1 flex justify-end">
          <MessageAvatarHeader name="User" time="12:25" />
        </div>

        {/* 附件内容，右对齐 */}
        <UserMessageAttachments />

        {/* 消息内容，右对齐 */}
        <div className="aui-user-message-content-wrapper relative col-start-2 row-start-3 min-w-0 flex justify-end">
          <WuhanUserMessage className="aui-user-message-content break-words">
            <MessagePrimitive.Parts />
          </WuhanUserMessage>
          <div className="absolute top-full right-0 z-10 mt-2">
            <UserActionBar />
          </div>
        </div>

        <BranchPicker className="aui-user-branch-picker col-span-full col-start-1 row-start-4 -mr-1 justify-end" />
      </div>
    </MessagePrimitive.Root>
  );
};
