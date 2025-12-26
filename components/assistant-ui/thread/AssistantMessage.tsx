import type { FC } from "react";
import { MessagePrimitive } from "@assistant-ui/react";
import { MarkdownText } from "../markdown-text";
import { ToolFallback } from "../tool-fallback";
import { BranchPicker } from "./BranchPicker";
import { MessageError } from "./MessageError";
import { AssistantActionBar } from "./AssistantActionBar";
import { Reference } from "./primitives/reference";
import { MessageSquareQuote } from "lucide-react";

export const AssistantMessage: FC = () => {
  return (
    <MessagePrimitive.Root asChild>
      <div
        className="aui-assistant-message-root relative mx-auto w-full max-w-[var(--thread-max-width)] animate-in py-4 duration-150 ease-out fade-in slide-in-from-bottom-1 last:mb-24"
        data-role="assistant"
      >
        <Reference.Root asChild>
          <div className="aui-assistant-message-content mx-2 leading-7 break-words text-foreground">
            <MessagePrimitive.Parts
              components={{
                Text: MarkdownText,
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
      </div>
    </MessagePrimitive.Root>
  );
};
