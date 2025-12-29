import * as React from "react";
import type { FC } from "react";
import { ComposerPrimitive, MessagePrimitive } from "@assistant-ui/react";
import { TooltipIconButton } from "../tooltip-icon-button";
import { PlusIcon } from "lucide-react";
import { AttachmentList } from "@/components/wuhan/blocks/attachment-list-01";
import { AttachmentCardItem } from "./AttachmentCardItem";

export const UserMessageAttachments: FC = () => {
  return (
    <div className="aui-user-message-attachments-end col-start-2 row-start-2 flex flex-row justify-end empty:hidden">
      <AttachmentList className="!w-auto max-w-full">
        <MessagePrimitive.Attachments
          components={{ Attachment: AttachmentCardItem }}
        />
      </AttachmentList>
    </div>
  );
};

export const ComposerAttachments: FC = () => {
  return (
    <AttachmentList className="w-full">
      <ComposerPrimitive.Attachments
        components={{ Attachment: AttachmentCardItem }}
      />
    </AttachmentList>
  );
};

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
      >
        <PlusIcon className="aui-attachment-add-icon size-5 stroke-[1.5px]" />
      </TooltipIconButton>
    </ComposerPrimitive.AddAttachment>
  );
};
