import type { FC } from "react";
import { ComposerPrimitive, ThreadPrimitive, useAssistantState } from "@assistant-ui/react";
import { SenderSendButton } from "@/components/wuhan/blocks/sender-01";
import { Send, Square } from "lucide-react";
import { useShallow } from "zustand/shallow";
import {
  BlockTooltip,
  BlockTooltipTrigger,
  BlockTooltipContent,
} from "@/components/wuhan/blocks/tooltip-01";

export const ComposerAction: FC = () => {
  const canSend = useAssistantState(
    useShallow(({ composer }) => {
      const text = composer.text?.trim() || "";
      return text.length > 0;
    }),
  );

  return (
    <>
      <ThreadPrimitive.If running={false}>
        <BlockTooltip>
          <BlockTooltipTrigger asChild>
            <span className="inline-block">
              <ComposerPrimitive.Send asChild>
                <SenderSendButton disabled={!canSend} aria-label="Send message">
                  <Send className="size-4" />
                </SenderSendButton>
              </ComposerPrimitive.Send>
            </span>
          </BlockTooltipTrigger>
          <BlockTooltipContent side="top">发送</BlockTooltipContent>
        </BlockTooltip>
      </ThreadPrimitive.If>

      <ThreadPrimitive.If running>
        <BlockTooltip>
          <BlockTooltipTrigger asChild>
            <ComposerPrimitive.Cancel asChild>
              <SenderSendButton generating disabled={false} aria-label="Stop generating">
                <Square className="size-3.5 fill-white dark:fill-black" />
              </SenderSendButton>
            </ComposerPrimitive.Cancel>
          </BlockTooltipTrigger>
          <BlockTooltipContent side="top">停止回答</BlockTooltipContent>
        </BlockTooltip>
      </ThreadPrimitive.If>
    </>
  );
};
