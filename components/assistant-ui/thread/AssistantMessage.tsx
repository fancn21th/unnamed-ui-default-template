import type { FC } from "react";
import { MessagePrimitive } from "@assistant-ui/react";
import { MarkdownText, Image } from "../messages";
import { ToolFallback } from "../tools/tool-fallback";
import { BranchPicker } from "./BranchPicker";
import { MessageError } from "./MessageError";
import { AssistantActionBar } from "./AssistantActionBar";
import { Reference } from "./primitives/reference";
import { BotMessageSquare, MessageSquareQuote } from "lucide-react";
import { ActionBarExtend } from "./primitives/action-bar-extend";
import { DislikeFeedbackForm } from "@/components/assistant-ui/thread/primitives/action-bar-extend/DislikeFeedbackForm";
import { MessageHeader } from "@/components/assistant-ui/thread/primitives/message-header";

export const AssistantMessage: FC = () => {
  return (
    <MessagePrimitive.Root asChild>
      <div
        className="aui-assistant-message-root relative mx-auto w-full max-w-[var(--thread-max-width)] animate-in py-4 duration-150 ease-out fade-in slide-in-from-bottom-1 last:mb-24"
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
          <div className="aui-assistant-message-content mx-2 leading-7 break-words text-foreground">
            <MessagePrimitive.Parts
              components={{
                Text: MarkdownText,
                Image: Image,
                tools: { Fallback: ToolFallback },
              }}
            />
            <MessageError />

            <Reference.ActionBar className={"flex bg-accent p-1"}>
              <Reference.Use className={"flex gap-1"}>
                <MessageSquareQuote />
                引用
              </Reference.Use>
            </Reference.ActionBar>
          </div>
        </Reference.Root>

        <div className="aui-assistant-message-footer mt-2 ml-2 flex">
          <BranchPicker />
          <AssistantActionBar />
        </div>
        <ActionBarExtend.If dislikeFeedback>
          <DislikeFeedbackForm />
        </ActionBarExtend.If>
      </div>
    </MessagePrimitive.Root>
  );
};
