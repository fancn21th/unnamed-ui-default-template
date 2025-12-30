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
import { TooltipIconButton } from "../tooltip-icon-button";
import { DislikeFeedbackForm } from "./primitives/action-bar-extend/DislikeFeedbackForm";
import { useSmartVisionActionActions } from "@/runtime/smartVisionActionRuntime";

export const AssistantMessage: FC = () => {
  const { isFeedbackOpen, closeFeedback, onDislike } = useSmartVisionActionActions();

  const handleFeedbackSubmit = (data: { option?: string; content?: string }) => {
    // Pass content to onDislike (maintaining backward compatibility)
    onDislike(data.content);
    // Note: option could be stored separately if needed in the future
  };

  return (
    <MessagePrimitive.Root asChild>
      <div
        className="aui-assistant-message-root relative mx-auto w-full max-w-[var(--thread-max-width)] animate-in py-4 duration-150 ease-out fade-in slide-in-from-bottom-1 last:mb-24"
        data-role="assistant"
      >
        <Reference.Root asChild>
          <div className="">
            {/* MessageAvatarHeader 显示在顶部，左对齐 */}
            <div className="flex justify-start">
              <MessageAvatarHeader name="Assistant" time="12:25" />
            </div>
            <WuhanAIMessage
              className="break-words px-0"
              feedback={
                <div className="aui-assistant-message-footer mt-2 flex flex-col">
                  <div className="flex">
                    <BranchPicker />
                    <AssistantActionBar />
                  </div>
                  {isFeedbackOpen && (
                    <div className="mt-2">
                      <DislikeFeedbackForm
                        onSubmit={handleFeedbackSubmit}
                        onClose={closeFeedback}
                      />
                    </div>
                  )}
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

            <Reference.ActionBar className={"flex h-8 rounded-[var(--radius-lg)] border border-[var(--border-neutral)] bg-[var(--bg-container)] py-1 px-1 gap-1"}>
              <Reference.Use className={"flex gap-1"}>
                <TooltipIconButton tooltip="引用" side="bottom" variant="ghost" size="icon">
                  <MessageSquareQuote />
                </TooltipIconButton>
              </Reference.Use>
            </Reference.ActionBar>
          </div>
        </Reference.Root>

      </div>
    </MessagePrimitive.Root>
  );
};
