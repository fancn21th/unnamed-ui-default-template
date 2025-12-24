import type { FC } from "react";
import { AttachmentList } from "@/components/wuhan/blocks/attachment-list-01";
import { ComposerPrimitive } from "@assistant-ui/react";
import { AttachmentCardItem } from "./AttachmentCardItem";

export const ComposerAttachments: FC = () => {
  return (
    <AttachmentList className="w-full">
      <ComposerPrimitive.Attachments
        components={{ Attachment: AttachmentCardItem }}
      />
    </AttachmentList>
  );
};