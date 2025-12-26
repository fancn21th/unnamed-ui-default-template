import type { FC } from "react";
import { MessagePrimitive } from "@assistant-ui/react";
import { AttachmentList } from "@/components/wuhan/blocks/attachment-list-01";
import { AttachmentCardItem } from "./AttachmentCardItem";

export const UserMessageAttachments: FC = () => {
  return (
    <div className="aui-user-message-attachments-end col-span-full col-start-1 row-start-1 flex w-full flex-row justify-end empty:hidden">
      <AttachmentList className="w-full">
        <MessagePrimitive.Attachments
          components={{ Attachment: AttachmentCardItem }}
        />
      </AttachmentList>
    </div>
  );
};