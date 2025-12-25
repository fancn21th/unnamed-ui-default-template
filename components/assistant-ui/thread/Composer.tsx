import type { FC } from "react";
import { ComposerPrimitive } from "@assistant-ui/react";
import {
  SenderActionBar,
  SenderAttachmentButton,
  SenderContainer,
  SenderTextarea,
} from "@/components/wuhan/blocks/sender-01";
import { ThreadScrollToBottom } from "./ThreadScrollToBottom";
import { ComposerAttachmentsRegion } from "./ComposerAttachmentsRegion";
import { ComposerAction } from "./ComposerAction";

export const Composer: FC = () => {
  return (
    <div className="aui-composer-wrapper sticky bottom-0 mx-auto flex w-full max-w-[var(--thread-max-width)] flex-col gap-4 overflow-visible rounded-t-3xl bg-background pb-4 md:pb-6">
      <ThreadScrollToBottom />
      <ComposerPrimitive.Root asChild>
        <SenderContainer className="aui-composer-root shadow-[0_9px_9px_0px_rgba(0,0,0,0.01),0_2px_5px_0px_rgba(0,0,0,0.06)] dark:border-muted-foreground/15">
          <ComposerAttachmentsRegion />
          <ComposerPrimitive.Input
            placeholder="Send a message..."
            rows={1}
            autoFocus
            aria-label="Message input"
            asChild
          >
            <SenderTextarea />
          </ComposerPrimitive.Input>
          <SenderActionBar className="flex items-center justify-between">
            <ComposerPrimitive.AddAttachment asChild>
              <SenderAttachmentButton
                className="cursor-pointer"
                aria-label="Add Attachment"
              />
            </ComposerPrimitive.AddAttachment>
            <ComposerAction />
          </SenderActionBar>
        </SenderContainer>
      </ComposerPrimitive.Root>
    </div>
  );
};
