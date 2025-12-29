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
        <TooltipIconButton tooltip="Edit" className="aui-user-action-edit p-4">
          <PencilIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Edit>
    </ActionBarPrimitive.Root>
  );
};
