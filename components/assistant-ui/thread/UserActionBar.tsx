import { ActionBarPrimitive } from "@assistant-ui/react";
import { FC } from "react";
import { TooltipIconButton } from "../tooltip-icon-button";
import { PencilIcon } from "lucide-react";

export const UserActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="never"
      className="aui-user-action-bar-root flex flex-col items-end text-muted-foreground"
    >
      <ActionBarPrimitive.Edit asChild>
        <TooltipIconButton tooltip="编辑" className="aui-user-action-edit hover:w-6 hover:h-6 hover:p-1">
          <PencilIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Edit>
    </ActionBarPrimitive.Root>
  );
};
