import {
  Attachment,
  AttachmentAdapter,
  CompleteAttachment,
  PendingAttachment,
} from "@assistant-ui/react";

export class SmartVisionFileAttachmentAdapter implements AttachmentAdapter {
  public accept = "*";
  add(state: {
    file: File;
  }): Promise<PendingAttachment> | AsyncGenerator<PendingAttachment, void> {
    throw new Error("Method not implemented.");
  }
  remove(attachment: Attachment): Promise<void> {
    throw new Error("Method not implemented.");
  }
  send(attachment: PendingAttachment): Promise<CompleteAttachment> {
    throw new Error("Method not implemented.");
  }
}
