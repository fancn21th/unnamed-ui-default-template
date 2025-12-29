import type { FC } from "react";
import { MessagePrimitive } from "@assistant-ui/react";
import { LoadingDots, MessageGeneratingPrimitive, AIMessage as WuhanAIMessage } from "../../wuhan/blocks/message-01";
import { MarkdownText } from "../markdown-text";
import { ToolFallback } from "../tool-fallback";
import { BranchPicker } from "./BranchPicker";
import { AssistantActionBar } from "./AssistantActionBar";
import { Reference } from "./primitives/reference";
import { MessageSquareQuote } from "lucide-react";
import { MessageError } from "./MessageError";
import { MessageAvatarHeader } from "@/components/wuhan/blocks/avatar-header-01";

export const AssistantMessage: FC = () => {
  return (
    <MessagePrimitive.Root asChild>
      <div
        className="aui-assistant-message-root relative mx-auto w-full max-w-[var(--thread-max-width)] animate-in py-4 duration-150 ease-out fade-in slide-in-from-bottom-1 last:mb-24"
        data-role="assistant"
      >
        <Reference.Root asChild>
          <div className="mx-2">
            {/* MessageAvatarHeader 显示在顶部，左对齐 */}
            <div className="flex justify-start">
              <MessageAvatarHeader name="Assistant" time="12:25" />
            </div>
            <WuhanAIMessage
              className="break-words px-0"
              feedback={
                <div className="aui-assistant-message-footer mt-2 flex px-0">
                  <BranchPicker />
                  <AssistantActionBar />
                </div>
              }
            >
              <div className="aui-assistant-message-content leading-7 break-words">
                <MessagePrimitive.Parts
                  components={{
                    Text: MarkdownText,
                    tools: { Fallback: ToolFallback },
                    Empty: () => <MessageGeneratingPrimitive
                      indicator={<LoadingDots />}
                      text="正在生成中..."
                    />,
                    
                  }}
                />
                <MessageError />
              </div>
            </WuhanAIMessage>

            <Reference.ActionBar className={"flex bg-accent p-1"}>s
              <Reference.Use className={"flex gap-1"}>
                <MessageSquareQuote />
                引用
              </Reference.Use>
            </Reference.ActionBar>
          </div>
        </Reference.Root>

      </div>
    </MessagePrimitive.Root>
  );
};
