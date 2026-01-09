import type { FC } from "react";
import { useState } from "react";
import { ComposerPrimitive, ThreadPrimitive } from "@assistant-ui/react";
import { TooltipIconButton } from "../tooltip-icon-button";
import { ArrowUpIcon, Brain, Search, Grid3x3, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActionBarExtend } from "./primitives/action-bar-extend";
import {
  SenderAttachmentButton,
  SenderModeButton,
} from "@/components/wuhan/blocks/sender-01";
import {
  BlockTooltip,
  BlockTooltipTrigger,
  BlockTooltipContent,
} from "@/components/wuhan/blocks/tooltip-01";

export const ComposerAction: FC = () => {
  const [isComponentMode, setIsComponentMode] = useState(false);

  return (
    <div className="aui-composer-action-wrapper relative w-full flex items-end justify-between">
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
        <ActionBarExtend.If deepThink={true}>
          <ActionBarExtend.DeepThink asChild>
            <SenderModeButton
              selected={true}
              type="button"
              aria-label="Deep Think Mode"
            >
              <Brain className="size-4" />
              思考
            </SenderModeButton>
          </ActionBarExtend.DeepThink>
        </ActionBarExtend.If>
        <ActionBarExtend.If deepThink={false}>
          <ActionBarExtend.DeepThink asChild>
            <SenderModeButton
              selected={false}
              type="button"
              aria-label="Deep Think Mode"
            >
              <Brain className="size-4" />
              思考
            </SenderModeButton>
          </ActionBarExtend.DeepThink>
        </ActionBarExtend.If>
        <ActionBarExtend.If webSearch={true}>
          <ActionBarExtend.WebSearch asChild>
            <SenderModeButton
              selected={true}
              type="button"
              aria-label="Web Search Mode"
            >
              <Search className="size-4" />
              搜索
            </SenderModeButton>
          </ActionBarExtend.WebSearch>
        </ActionBarExtend.If>
        <ActionBarExtend.If webSearch={false}>
          <ActionBarExtend.WebSearch asChild>
            <SenderModeButton
              selected={false}
              type="button"
              aria-label="Web Search Mode"
            >
              <Search className="size-4" />
              搜索
            </SenderModeButton>
          </ActionBarExtend.WebSearch>
        </ActionBarExtend.If>
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

      <ThreadPrimitive.If running={false}>
        <ComposerPrimitive.Send asChild>
          <TooltipIconButton
            tooltip="Send message"
            side="bottom"
            type="submit"
            variant="default"
            size="icon"
            className="aui-composer-send size-[32px] rounded-full p-1"
            aria-label="Send message"
          >
            <ArrowUpIcon className="aui-composer-send-icon size-5" />
          </TooltipIconButton>
        </ComposerPrimitive.Send>
      </ThreadPrimitive.If>

      <ThreadPrimitive.If running>
        <ComposerPrimitive.Cancel asChild>
          <Button
            type="button"
            variant="default"
            size="icon"
            className="aui-composer-cancel size-[34px] rounded-full border border-muted-foreground/60 hover:bg-primary/75 dark:border-muted-foreground/90"
            aria-label="Stop generating"
          >
            <Square className="aui-composer-cancel-icon size-3.5 fill-white dark:fill-black" />
          </Button>
        </ComposerPrimitive.Cancel>
      </ThreadPrimitive.If>
    </div>
  );
};
