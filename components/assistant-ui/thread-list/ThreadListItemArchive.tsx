import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import { FC } from "react";
import { ArchiveIcon } from "lucide-react";
import { ThreadListItemPrimitive } from "@assistant-ui/react";

export const ThreadListItemArchive: FC = () => {
  return (
    <ThreadListItemPrimitive.Archive asChild>
      <TooltipIconButton
        className="aui-thread-list-item-archive mr-3 ml-auto size-4 p-0 text-foreground hover:text-primary"
        variant="ghost"
        tooltip="Archive thread"
      >
        <ArchiveIcon />
      </TooltipIconButton>
    </ThreadListItemPrimitive.Archive>
  );
};
