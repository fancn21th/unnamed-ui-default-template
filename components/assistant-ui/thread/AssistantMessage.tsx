import type { FC } from "react";
import { MessagePrimitive } from "@assistant-ui/react";
import { AIMessage as WuhanAIMessage } from "../../wuhan/blocks/message-01";
import { MarkdownText } from "../markdown-text";
import { ToolFallback } from "../tool-fallback";
import { BranchPicker } from "./BranchPicker";
import { AssistantActionBar } from "./AssistantActionBar";
import { Reference } from "./primitives/reference";
import { MessageSquareQuote } from "lucide-react";
import { MessageError } from "./MessageError";

export const AssistantMessage: FC = () => {
  return (
    <MessagePrimitive.Root asChild>
      <div
        className="aui-assistant-message-root relative mx-auto w-full max-w-[var(--thread-max-width)] animate-in py-4 duration-150 ease-out fade-in slide-in-from-bottom-1 last:mb-24"
        data-role="assistant"
      >
        <Reference.Root asChild>
          <div className="mx-2">
            <WuhanAIMessage
              className="break-words"
              feedback={
                <div className="aui-assistant-message-footer mt-2 flex">
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
                  }}
                />
                <MessageError />
              </div>
            </WuhanAIMessage>

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
      </div>
    </MessagePrimitive.Root>
  );
};
