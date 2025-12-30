import type { FC } from "react";
import { ActionBarPrimitive, MessagePrimitive } from "@assistant-ui/react";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import {
  CheckIcon,
  CopyIcon,
  RefreshCwIcon,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { ActionBarExtend } from "@/components/assistant-ui/thread/primitives/action-bar-extend";
import { useDislikeFeedback } from "@/components/assistant-ui/thread/primitives/action-bar-extend/DislikeFeedbackContext";
import { DislikeFeedbackForm } from "@/components/assistant-ui/thread/primitives/action-bar-extend/DislikeFeedbackForm";
import { useSmartVisionActionActions } from "@/runtime/smartVisionActionRuntime";

export const AssistantActionBar: FC = () => {
  const { isOpen, closeFeedback } = useDislikeFeedback();
  const { onDislike } = useSmartVisionActionActions();

  return (
    <div className="w-full">
      <ActionBarPrimitive.Root
        hideWhenRunning
        autohide="never"
        autohideFloat="single-branch"
        className="aui-assistant-action-bar-root  col-start-3 row-start-2 -ml-1 flex gap-1 text-muted-foreground data-floating:absolute data-floating:rounded-md data-floating:border data-floating:bg-background data-floating:p-1 data-floating:shadow-sm"
      >
        <ActionBarExtend.Like asChild>
          <TooltipIconButton tooltip="Like">
            <ActionBarExtend.If like>
              <ThumbsUp className="fill-[var(--primary)] stroke-none" />
            </ActionBarExtend.If>
            <ActionBarExtend.If like={false}>
              <ThumbsUp />
            </ActionBarExtend.If>
          </TooltipIconButton>
        </ActionBarExtend.Like>
        <ActionBarExtend.Dislike asChild>
          <TooltipIconButton tooltip="Dislike">
            <ActionBarExtend.If dislike>
              <ThumbsDown className="fill-[var(--primary)] stroke-none" />
            </ActionBarExtend.If>
            <ActionBarExtend.If dislike={false}>
              <ThumbsDown />
            </ActionBarExtend.If>
          </TooltipIconButton>
        </ActionBarExtend.Dislike>
        <ActionBarPrimitive.Copy asChild>
          <TooltipIconButton tooltip="Copy">
            <MessagePrimitive.If copied>
              <CheckIcon />
            </MessagePrimitive.If>
            <MessagePrimitive.If copied={false}>
              <CopyIcon />
            </MessagePrimitive.If>
          </TooltipIconButton>
        </ActionBarPrimitive.Copy>
        <ActionBarPrimitive.Reload asChild>
          <TooltipIconButton tooltip="Refresh">
            <RefreshCwIcon />
          </TooltipIconButton>
        </ActionBarPrimitive.Reload>
      </ActionBarPrimitive.Root>
      {isOpen && (
        <div className="mt-2">
          <DislikeFeedbackForm
            onSubmit={onDislike}
            onClose={closeFeedback}
          />
        </div>
      )}
    </div>
  );
};
