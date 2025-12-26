import { ThreadListItemPrimitive } from "@assistant-ui/react";
import { FC } from "react";
import { TooltipIconButton } from "../tooltip-icon-button";
import { ArchiveIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const ThreadListItemArchive: FC = () => {
  return (
    <ThreadListItemPrimitive.Archive asChild>
      <TooltipIconButton
        className={cn(
          "size-4 p-0",
          "text-[var(--text-secondary)]",
          "hover:text-[var(--text-primary)]"
        )}
        variant="ghost"
        tooltip="归档对话"
      >
        <ArchiveIcon className="size-3" />
      </TooltipIconButton>
    </ThreadListItemPrimitive.Archive>
  );
};
