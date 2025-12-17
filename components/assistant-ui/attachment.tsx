"use client";

import {
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
  type FC,
} from "react";
import Image from "next/image";
import { XIcon, PlusIcon, FileText } from "lucide-react";
import {
  AttachmentPrimitive,
  ComposerPrimitive,
  MessagePrimitive,
  useAssistantState,
  useAssistantApi,
} from "@assistant-ui/react";
import { useShallow } from "zustand/shallow";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import {
  AttachmentCard,
  AttachmentCardContent,
  AttachmentCardDeleteButton,
  AttachmentCardLeading,
  AttachmentCardMeta,
  AttachmentCardTitle,
  AttachmentList,
  AttachmentLoadingIndicator,
} from "@/components/wuhan/blocks/attachment-list-01";
import { cn } from "@/lib/utils";

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

const useFileSrc = (file: File | undefined) => {
  const [src, setSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!file) {
      setSrc(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setSrc(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  return src;
};

const useAttachmentSrc = () => {
  const { file, src } = useAssistantState(
    useShallow(({ attachment }): { file?: File; src?: string } => {
      if (attachment.type !== "image") return {};
      if (attachment.file) return { file: attachment.file };
      const src = attachment.content?.filter((c) => c.type === "image")[0]
        ?.image;
      if (!src) return {};
      return { src };
    }),
  );

  return useFileSrc(file) ?? src;
};

type AttachmentPreviewProps = {
  src: string;
};

const AttachmentPreview: FC<AttachmentPreviewProps> = ({ src }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <Image
      src={src}
      alt="Image Preview"
      width={1}
      height={1}
      className={
        isLoaded
          ? "aui-attachment-preview-image-loaded block h-auto max-h-[80vh] w-auto max-w-full object-contain"
          : "aui-attachment-preview-image-loading hidden"
      }
      onLoadingComplete={() => setIsLoaded(true)}
      priority={false}
    />
  );
};

const AttachmentPreviewDialog: FC<PropsWithChildren> = ({ children }) => {
  const src = useAttachmentSrc();

  if (!src) return children;

  return (
    <Dialog>
      <DialogTrigger
        className="aui-attachment-preview-trigger cursor-pointer transition-colors hover:bg-accent/50"
        asChild
      >
        {children}
      </DialogTrigger>
      <DialogContent className="aui-attachment-preview-dialog-content p-2 sm:max-w-3xl [&_svg]:text-background [&>button]:rounded-full [&>button]:bg-foreground/60 [&>button]:p-1 [&>button]:opacity-100 [&>button]:!ring-0 [&>button]:hover:[&_svg]:text-destructive">
        <DialogTitle className="aui-sr-only sr-only">
          Image Attachment Preview
        </DialogTitle>
        <div className="aui-attachment-preview relative mx-auto flex max-h-[80dvh] w-full items-center justify-center overflow-hidden bg-background">
          <AttachmentPreview src={src} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

const AttachmentCardItemIcon = () => {
  const { isImage, name, status } = useAssistantState(
    useShallow(({ attachment }) => {
      const isImage = attachment.type === "image";
      const name = attachment.file?.name ?? attachment.name ?? "Attachment";
      const status = attachment.status;
      return { isImage, name, status };
    }),
  );
  const src = useAttachmentSrc();
  if (status.type === "running") {
    return <AttachmentLoadingIndicator />;
  }
  if (isImage) {
    if (src) {
      return (
        <Image
          src={src}
          alt={name}
          width={56}
          height={56}
          className="h-full w-full object-cover"
        />
      );
    }
    return (
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--border-brand)] border-t-[var(--divider-neutral-basic)]" />
    );
  }
  return <FileText className="size-5 text-muted-foreground" />;
};

const AttachmentCardItem: FC = () => {
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

export const UserMessageAttachments: FC = () => {
  return (
    <div className="aui-user-message-attachments-end col-span-full col-start-1 row-start-1 flex w-full flex-row justify-end gap-2 overflow-x-auto empty:hidden">
      <MessagePrimitive.Attachments
        components={{ Attachment: AttachmentCardItem }}
      />
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
