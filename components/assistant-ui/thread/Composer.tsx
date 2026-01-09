import type { FC } from "react";
import { ComposerPrimitive } from "@assistant-ui/react";
import {
  SenderActionBar,
  SenderContainer,
} from "@/components/wuhan/blocks/sender-01";
import { ThreadScrollToBottom } from "./ThreadScrollToBottom";
import { ComposerAttachmentsRegion } from "./ComposerAttachmentsRegion";
import { ComposerAction } from "./ComposerAction";
import { ThreadReference } from "./ThreadReference";
import { SenderInput } from "./SenderInput";
import { cn } from "@/lib/utils";

interface ComposerProps {
  sticky?: boolean;
}

export const Composer: FC<ComposerProps> = ({ sticky = true }) => {


  return (
    <div className={cn(
      "aui-composer-wrapper z-10 mx-auto flex w-full max-w-[var(--thread-max-width)] flex-col gap-0 overflow-visible rounded-t-3xl bg-background pb-4 md:pb-6",
      sticky && "sticky bottom-0"
    )}>
      <ThreadScrollToBottom />

      <ComposerPrimitive.Root asChild>
        <SenderContainer className="aui-composer-root gap-0 dark:border-muted-foreground/15">
          <div className="flex flex-col gap-3">
            <ThreadReference />
            <ComposerAttachmentsRegion />
          </div>
          <div className="flex flex-col gap-4">
            <ComposerPrimitive.Input
              placeholder="Send a message..."
              rows={1}
              autoFocus
              aria-label="Message input"
              asChild
            >
              <SenderInput />
            </ComposerPrimitive.Input>
            <SenderActionBar className="flex items-center justify-between">
              <ComposerAction />
            </SenderActionBar>
          </div>
        </SenderContainer>
      </ComposerPrimitive.Root>
    </div>
  );
};
