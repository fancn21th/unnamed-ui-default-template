import {
  AttachmentPrimitive,
  useAssistantApi,
  useAssistantState,
} from "@assistant-ui/react";
import { FC } from "react";
import { Tooltip } from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";
import { TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AttachmentRemove } from "./AttachmentRemove";
import { AttachmentThumb } from "./AttachmentThumb";
import { AttachmentPreviewDialog } from "./AttachmentPreviewDialog";

export const AttachmentUI: FC = () => {
  const api = useAssistantApi();
  const isComposer = api.attachment.source === "composer";

  const isImage = useAssistantState(
    ({ attachment }) => attachment.type === "image",
  );
  const typeLabel = useAssistantState(({ attachment }) => {
    const type = attachment.type;
    switch (type) {
      case "image":
        return "Image";
      case "document":
        return "Document";
      case "file":
        return "File";
      default:
        const _exhaustiveCheck: never = type;
        throw new Error(`Unknown attachment type: ${_exhaustiveCheck}`);
    }
  });

  return (
    <Tooltip>
      <AttachmentPrimitive.Root
        className={cn(
          "aui-attachment-root relative",
          isImage &&
            "aui-attachment-root-composer only:[&>#attachment-tile]:size-24",
        )}
      >
        <AttachmentPreviewDialog>
          <TooltipTrigger asChild>
            <div
              className={cn(
                "aui-attachment-tile size-14 cursor-pointer overflow-hidden rounded-[14px] border bg-muted transition-opacity hover:opacity-75",
                isComposer &&
                  "aui-attachment-tile-composer border-foreground/20",
              )}
              role="button"
              id="attachment-tile"
              aria-label={`${typeLabel} attachment`}
            >
              <AttachmentThumb />
            </div>
          </TooltipTrigger>
        </AttachmentPreviewDialog>
        {isComposer && <AttachmentRemove />}
      </AttachmentPrimitive.Root>
      <TooltipContent side="top">
        <AttachmentPrimitive.Name />
      </TooltipContent>
    </Tooltip>
  );
};
