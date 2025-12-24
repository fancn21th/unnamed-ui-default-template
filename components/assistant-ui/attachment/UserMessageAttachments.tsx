import type { FC } from "react";
import { MessagePrimitive } from "@assistant-ui/react";
import { AttachmentCardItem } from "./AttachmentCardItem";

export const UserMessageAttachments: FC = () => {
  return (
    <div className="aui-user-message-attachments-end col-span-full col-start-1 row-start-1 flex w-full flex-row justify-end gap-2 overflow-x-auto empty:hidden">
      <MessagePrimitive.Attachments
        components={{ Attachment: AttachmentCardItem }}
      />
    </div>
  );
};