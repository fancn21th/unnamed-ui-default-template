import type { FC } from "react";
import { useState } from "react";
import { ComposerPrimitive } from "@assistant-ui/react";
import {
  SenderActionBar,
  SenderAttachmentButton,
  SenderContainer,
  SenderModeButton,
} from "@/components/wuhan/blocks/sender-01";
import { Brain, Search, Grid3x3 } from "lucide-react";
import { ThreadScrollToBottom } from "./ThreadScrollToBottom";
import { ComposerAttachmentsRegion } from "./ComposerAttachmentsRegion";
import { ComposerAction } from "./ComposerAction";
import { ThreadReference } from "./ThreadReference";
import { SenderInput } from "./SenderInput";
import { cn } from "@/lib/utils";
import {
  BlockTooltip,
  BlockTooltipTrigger,
  BlockTooltipContent,
} from "@/components/wuhan/blocks/tooltip-01";

interface ComposerProps {
  sticky?: boolean;
}

export const Composer: FC<ComposerProps> = ({ sticky = true }) => {
  /**
   * 后续应加入到runtime中，目前只是为了演示，不做任何处理
   * 深度思考模式
   * 联网搜索模式
   * 组件模式
   */
  const [isDeepThinkMode, setIsDeepThinkMode] = useState(false);
  const [isWebSearchMode, setIsWebSearchMode] = useState(false);
  const [isComponentMode, setIsComponentMode] = useState(false);


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
              <div className="flex items-center gap-1">
                <BlockTooltip>
                  <BlockTooltipTrigger asChild>
                    <ComposerPrimitive.AddAttachment asChild>
                      <SenderAttachmentButton
                        className="cursor-pointer border-none"
                        aria-label="Add Attachment"
                      />
                    </ComposerPrimitive.AddAttachment>
                  </BlockTooltipTrigger>
                  <BlockTooltipContent side="top">上传附件</BlockTooltipContent>
                </BlockTooltip>
                <SenderModeButton
                  selected={isDeepThinkMode}
                  onClick={() => setIsDeepThinkMode(!isDeepThinkMode)}
                  type="button"
                  aria-label="Deep Think Mode"
                >
                  <Brain className="size-4" />
                  思考
                </SenderModeButton>
                <SenderModeButton
                  selected={isWebSearchMode}
                  onClick={() => setIsWebSearchMode(!isWebSearchMode)}
                  type="button"
                  aria-label="Web Search Mode"
                >
                  <Search className="size-4" />
                  联网搜索
                </SenderModeButton>
                <SenderModeButton
                  selected={isComponentMode}
                  onClick={() => setIsComponentMode(!isComponentMode)}
                  type="button"
                  aria-label="Component Mode"
                >
                  <Grid3x3 className="size-4" />
                  组件
                </SenderModeButton>
              </div>
              <ComposerAction />
            </SenderActionBar>
          </div>
        </SenderContainer>
      </ComposerPrimitive.Root>
    </div>
  );
};
