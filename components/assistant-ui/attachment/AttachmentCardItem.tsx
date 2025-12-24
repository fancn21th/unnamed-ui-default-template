import { FC, useMemo } from "react";
import {
  AttachmentPrimitive,
  useAssistantApi,
  useAssistantState,
} from "@assistant-ui/react";
import {
  AttachmentCard,
  AttachmentCardContent,
  AttachmentCardDeleteButton,
  AttachmentCardLeading,
  AttachmentCardMeta,
  AttachmentCardTitle,
} from "@/components/wuhan/blocks/attachment-list-01";
import { XIcon } from "lucide-react";
import { useShallow } from "zustand/shallow";
import { cn } from "@/lib/utils";
import { AttachmentCardItemIcon } from "@/components/assistant-ui/attachment/AttachmentCardItemIcon";
import { AttachmentPreviewDialog } from "@/components/assistant-ui/attachment/AttachmentPreviewDialog";

const formatBytes = (bytes: number) => {
  if (!Number.isFinite(bytes) || bytes < 0) return undefined;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileTypeLabel = (
  name: string | undefined,
  type: "image" | "document" | "file",
) => {
  if (name) {
    const ext = name.split(".").pop()?.toUpperCase();
    if (ext) return ext;
  }
  switch (type) {
    case "image":
      return "IMG";
    case "document":
      return "DOC";
    case "file":
      return "FILE";
    default:
      return "FILE";
  }
};

export const AttachmentCardItem: FC = () => {
  const api = useAssistantApi();
  const isComposer = api.attachment.source === "composer";

  const { isImage, name, fileType, fileSize } = useAssistantState(
    useShallow(({ attachment }) => {
      const isImage = attachment.type === "image";
      const name = attachment.file?.name ?? attachment.name ?? "Attachment";
      const fileType = getFileTypeLabel(attachment.file?.name, attachment.type);
      const fileSize = attachment.file?.size
        ? formatBytes(attachment.file.size)
        : undefined;
      return { isImage, name, fileType, fileSize };
    }),
  );

  const metaText = useMemo(() => {
    if (fileType && fileSize) return `${fileType}·${fileSize}`;
    return fileSize || fileType;
  }, [fileType, fileSize]);

  const card = (
    <AttachmentCard
      variant="ghost"
      className={cn(
        isImage ? "h-14 w-14 p-0" : "h-14 max-w-[200px]",
        !isImage && "gap-[var(--gap-sm)] px-[var(--padding-com-md)]",
      )}
      aria-label={`${fileType} attachment`}
      title={name}
    >
      <AttachmentCardLeading
        className={cn(
          isImage
            ? "h-full w-full rounded-xl"
            : "h-10 w-10 rounded-lg bg-[var(--bg-container)]",
          "flex items-center justify-center overflow-hidden",
        )}
      >
        <AttachmentCardItemIcon />
      </AttachmentCardLeading>

      {!isImage && (
        <AttachmentCardContent>
          <AttachmentCardTitle>{name}</AttachmentCardTitle>
          {metaText && <AttachmentCardMeta>{metaText}</AttachmentCardMeta>}
        </AttachmentCardContent>
      )}

      {isComposer && (
        <AttachmentPrimitive.Remove asChild>
          <AttachmentCardDeleteButton
            aria-label="Delete attachment"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <XIcon className="size-3" />
          </AttachmentCardDeleteButton>
        </AttachmentPrimitive.Remove>
      )}
    </AttachmentCard>
  );

  return (
    <AttachmentPrimitive.Root>
      {isImage ? (
        <AttachmentPreviewDialog>{card}</AttachmentPreviewDialog>
      ) : (
        card
      )}
    </AttachmentPrimitive.Root>
  );
};
