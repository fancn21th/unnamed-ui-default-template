import type { FC } from "react";
import { ComposerAddAttachment } from "../attachment";
import { ComposerPrimitive, ThreadPrimitive } from "@assistant-ui/react";
import { TooltipIconButton } from "../tooltip-icon-button";
import { ArrowUpIcon, Brain, Search, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActionBarExtend } from "./primitives/action-bar-extend";

export const ComposerAction: FC = () => {
  return (
    <div className="aui-composer-action-wrapper relative mx-1 mt-2 mb-2 flex items-center justify-between">
      <div className="flex items-center gap-1">
        <ComposerAddAttachment />
        <ActionBarExtend.If deepThink={true}>
          <ActionBarExtend.DeepThink asChild>
            <TooltipIconButton
              tooltip="深度思考"
              side="bottom"
              variant="ghost"
              size="icon"
              className="aui-composer-add-attachment size-[34px] rounded-full bg-muted-foreground/15 p-1 text-xs font-semibold dark:border-muted-foreground/15 dark:hover:bg-muted-foreground/30"
              aria-label="Add Attachment"
            >
              <Brain className="aui-attachment-add-icon size-5 stroke-[1.5px]" />
            </TooltipIconButton>
          </ActionBarExtend.DeepThink>
        </ActionBarExtend.If>
        <ActionBarExtend.If deepThink={false}>
          <ActionBarExtend.DeepThink asChild>
            <TooltipIconButton
              tooltip="深度思考"
              side="bottom"
              variant="ghost"
              size="icon"
              className="aui-composer-add-attachment size-[34px] rounded-full p-1 text-xs font-semibold hover:bg-muted-foreground/15 dark:border-muted-foreground/15 dark:hover:bg-muted-foreground/30"
              aria-label="Add Attachment"
            >
              <Brain className="aui-attachment-add-icon size-5 stroke-[1.5px]" />
            </TooltipIconButton>
          </ActionBarExtend.DeepThink>
        </ActionBarExtend.If>

        <ActionBarExtend.If webSearch={true}>
          <ActionBarExtend.WebSearch asChild>
            <TooltipIconButton
              tooltip="联网搜索"
              side="bottom"
              variant="ghost"
              size="icon"
              className="aui-composer-add-attachment size-[34px] rounded-full bg-muted-foreground/15 p-1 text-xs font-semibold dark:border-muted-foreground/15 dark:hover:bg-muted-foreground/30"
              aria-label="Add Attachment"
            >
              <Search className="aui-attachment-add-icon size-5 stroke-[1.5px]" />
            </TooltipIconButton>
          </ActionBarExtend.WebSearch>
        </ActionBarExtend.If>
        <ActionBarExtend.If webSearch={false}>
          <ActionBarExtend.WebSearch asChild>
            <TooltipIconButton
              tooltip="联网搜索"
              side="bottom"
              variant="ghost"
              size="icon"
              className="aui-composer-add-attachment size-[34px] rounded-full p-1 text-xs font-semibold hover:bg-muted-foreground/15 dark:border-muted-foreground/15 dark:hover:bg-muted-foreground/30"
              aria-label="Add Attachment"
            >
              <Search className="aui-attachment-add-icon size-5 stroke-[1.5px]" />
            </TooltipIconButton>
          </ActionBarExtend.WebSearch>
        </ActionBarExtend.If>
      </div>

      <ThreadPrimitive.If running={false}>
        <ComposerPrimitive.Send asChild>
          <TooltipIconButton
            tooltip="Send message"
            side="bottom"
            type="submit"
            variant="default"
            size="icon"
            className="aui-composer-send size-[34px] rounded-full p-1"
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
