import { FC } from "react";
import { useAssistantState } from "@assistant-ui/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAttachmentSrc } from "./hooks";
import { FileText } from "lucide-react";

export const AttachmentThumb: FC = () => {
  const isImage = useAssistantState(
    ({ attachment }) => attachment.type === "image",
  );
  const src = useAttachmentSrc();

  return (
    <Avatar className="aui-attachment-tile-avatar h-full w-full rounded-none">
      <AvatarImage
        src={src}
        alt="Attachment preview"
        className="aui-attachment-tile-image object-cover"
      />
      <AvatarFallback delayMs={isImage ? 200 : 0}>
        <FileText className="aui-attachment-tile-fallback-icon size-8 text-muted-foreground" />
      </AvatarFallback>
    </Avatar>
  );
};
