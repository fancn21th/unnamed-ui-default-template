import type { FC } from "react";
import { ComposerPrimitive, ThreadPrimitive, useAssistantState } from "@assistant-ui/react";
import { SenderSendButton } from "@/components/wuhan/blocks/sender-01";
import { Send, Square } from "lucide-react";
import { useShallow } from "zustand/shallow";

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
        <ComposerPrimitive.Send asChild>
          <SenderSendButton disabled={!canSend} aria-label="Send message">
            <Send className="size-4" />
          </SenderSendButton>
        </ComposerPrimitive.Send>
      </ThreadPrimitive.If>

      <ThreadPrimitive.If running>
        <ComposerPrimitive.Cancel asChild>
          <SenderSendButton generating aria-label="Stop generating">
            <Square className="size-3.5 fill-white dark:fill-black" />
          </SenderSendButton>
        </ComposerPrimitive.Cancel>
      </ThreadPrimitive.If>
    </>
  );
};
