import type { FC } from "react";
import { ComposerPrimitive, ThreadPrimitive } from "@assistant-ui/react";
import { SenderSendButton } from "@/components/wuhan/blocks/sender-01";
import { Send, Square } from "lucide-react";

export const ComposerAction: FC = () => {
  return (
    <>
      <ThreadPrimitive.If running={false}>
        <ComposerPrimitive.Send asChild>
          <SenderSendButton aria-label="Send message">
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