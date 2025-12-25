import { AttachmentPrimitive } from "@assistant-ui/react";
import { FC } from "react";
import { TooltipIconButton } from "../tooltip-icon-button";
import { XIcon } from "lucide-react";

export const AttachmentRemove: FC = () => {
  return (
    <AttachmentPrimitive.Remove asChild>
      <TooltipIconButton
        tooltip="Remove file"
        className="aui-attachment-tile-remove absolute top-1.5 right-1.5 size-3.5 rounded-full bg-white text-muted-foreground opacity-100 shadow-sm hover:!bg-white [&_svg]:text-black hover:[&_svg]:text-destructive"
        side="top"
      >
        <XIcon className="aui-attachment-remove-icon size-3 dark:stroke-[2.5px]" />
      </TooltipIconButton>
    </AttachmentPrimitive.Remove>
  );
};
