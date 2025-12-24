import { ComposerPrimitive } from "@assistant-ui/react";
import { FC } from "react";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import { SenderAttachmentButton } from "@/components/wuhan/blocks/sender-01";
import { PlusIcon } from "lucide-react";

export const ComposerAddAttachment: FC = () => {
  return (
    <ComposerPrimitive.AddAttachment asChild>
      <TooltipIconButton
        tooltip="Add Attachment"
        side="bottom"
        variant="ghost"
        size="icon"
        className="aui-composer-add-attachment size-[34px] rounded-full p-1 text-xs font-semibold hover:bg-muted-foreground/15 dark:border-muted-foreground/15 dark:hover:bg-muted-foreground/30"
        aria-label="Add Attachment"
        asChild
      >
        <SenderAttachmentButton>
          <PlusIcon className="aui-attachment-add-icon size-5 stroke-[1.5px]" />
        </SenderAttachmentButton>
      </TooltipIconButton>
    </ComposerPrimitive.AddAttachment>
  );
};
