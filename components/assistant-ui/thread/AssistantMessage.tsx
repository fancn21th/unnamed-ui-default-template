import type { FC } from "react";
import { MessagePrimitive, useAssistantState } from "@assistant-ui/react";
import {
  LoadingDots,
  MessageGeneratingPrimitive,
  AIMessage as WuhanAIMessage,
} from "../../wuhan/blocks/message-01";
import { MarkdownText, Image } from "../messages";
import { ToolFallback } from "../tools/tool-fallback";
import { BranchPicker } from "./BranchPicker";
import { AssistantActionBar } from "./AssistantActionBar";
import { Reference } from "./primitives/reference";
import { BotMessageSquare, MessageSquareQuote } from "lucide-react";
import { ActionBarExtend } from "./primitives/action-bar-extend";
import { MessageError } from "./MessageError";
import { TooltipIconButton } from "../tooltip-icon-button";
import { DislikeFeedbackForm } from "@/components/assistant-ui/thread/primitives/action-bar-extend/DislikeFeedbackForm";
import { MessageHeader } from "@/components/assistant-ui/thread/primitives/message-header";
import { cn } from "@/lib/utils";

export const AssistantMessage: FC = () => {
  const isLastMessage = useAssistantState((state) => {
    const messages = state.thread.messages;
    const currentMessageId = state.message.id;
    const lastMessage = messages[messages.length - 1];
    return lastMessage?.id === currentMessageId;
  });

  return (
    <MessagePrimitive.Root asChild>
      <div
        className="aui-assistant-message-root group/assistant-message relative mx-auto w-full max-w-[var(--thread-max-width)] animate-in py-4 duration-150 ease-out fade-in slide-in-from-bottom-1 last:mb-24"
        data-role="assistant"
      >
        <MessageHeader.Root className="flex justify-start gap-1">
          <MessageHeader.Avatar asChild>
            <BotMessageSquare />
          </MessageHeader.Avatar>
          <MessageHeader.Name>Assistant UI</MessageHeader.Name>
          <MessageHeader.Time />
        </MessageHeader.Root>
        <Reference.Root asChild>
          <div className="">
            <WuhanAIMessage
              className="px-0 break-words"
              feedback={
                <div className="aui-assistant-message-footer mt-2 flex flex-col">
                  <div className="flex">
                    <BranchPicker />
                    <div className={cn(
                      "transition-opacity",
                      isLastMessage 
                        ? "opacity-100 pointer-events-auto" 
                        : "opacity-0 pointer-events-none group-hover/assistant-message:opacity-100 group-hover/assistant-message:pointer-events-auto"
                    )}>
                      <AssistantActionBar />
                    </div>
                  </div>
                  <ActionBarExtend.If dislikeFeedback>
                    <div className="mt-2">
                      <DislikeFeedbackForm />
                    </div>
                  </ActionBarExtend.If>
                </div>
              }
            >
              <div className="aui-assistant-message-content mx-2 leading-7 break-words text-foreground">
                <MessagePrimitive.Parts
                  components={{
                    Text: MarkdownText,
                    Image: Image,
                    tools: { Fallback: ToolFallback },
                    Empty: () => (
                      <MessageGeneratingPrimitive
                        indicator={<LoadingDots />}
                        text="正在生成中..."
                      />
                    ),
                  }}
                />
                <MessageError />
              </div>
            </WuhanAIMessage>
            <Reference.ActionBar className={"flex h-8 rounded-[var(--radius-lg)] border border-[var(--border-neutral)] bg-[var(--bg-container)] py-1 px-[calc(var(--gap-xs)-1px)] gap-1"}>
              <Reference.Use className={"flex gap-1"} asChild>
                <TooltipIconButton tooltip="引用"  side="bottom" variant="ghost" size="icon">
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
