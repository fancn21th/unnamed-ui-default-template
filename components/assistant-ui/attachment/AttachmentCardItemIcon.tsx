import { useAssistantState } from "@assistant-ui/react";
import { useShallow } from "zustand/shallow";
import { useAttachmentSrc } from "./utils";
import { AttachmentLoadingIndicator } from "@/components/wuhan/blocks/attachment-list-01";
import { FileText } from "lucide-react";
import Image from "next/image";

export const AttachmentCardItemIcon = () => {
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
