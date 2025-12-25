import { ThreadListItemPrimitive } from "@assistant-ui/react";
import { FC } from "react";
import { TooltipIconButton } from "../tooltip-icon-button";
import { ArchiveIcon } from "lucide-react";

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
