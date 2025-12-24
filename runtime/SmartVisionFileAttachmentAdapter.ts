import {
  Attachment,
  AttachmentAdapter,
  PendingAttachment,
} from "@assistant-ui/react";
import { uploadChatFile } from "./smartvisionApi";
import { nanoid } from "nanoid";
import { FileUploadResponse } from "./types";
import { AsyncQueue } from "@/lib/AsyncQueue";

type UploadEvent =
  | {
      type: "progress";
      value: number;
    }
  | {
      type: "complete";
      value: FileUploadResponse;
    }
  | {
      type: "error";
      value: Error;
    };
const fileIdMap: Record<string, string> = {};
export const smartVisionFileAttachmentAdapter: AttachmentAdapter = {
  accept: "*/*",
  async *add({ file }: { file: File }): AsyncGenerator<PendingAttachment> {
    const id = nanoid();
    const queue = new AsyncQueue<UploadEvent>();
    yield {
      id,
      type: file.type.startsWith("image/") ? "image" : "file",
      name: file.name,
      file,
      contentType: file.type,
      status: {
        type: "running",
        progress: 0,
        reason: "uploading",
      },
    };
    uploadChatFile(file, (progress) => {
      queue.push({ type: "progress", value: progress });
    })
      .then((data) => {
        queue.push({ type: "complete", value: data });
      })
      .catch((error) => {
        queue.push({ type: "error", value: error });
        throw error;
      });
    // 从队列中yield事件
    while (true) {
      const event = await queue.next();
      if (event.type === "error") {
        break;
      }
      if (event.type === "complete") {
        fileIdMap[id] = event.value.id;
        yield {
          id,
          type: file.type.startsWith("image/") ? "image" : "file",
          name: file.name,
          file,
          contentType: file.type,
          status: { type: "requires-action", reason: "composer-send" },
        };
        break;
      }
      yield {
        id,
        type: file.type.startsWith("image/") ? "image" : "file",
        name: file.name,
        file,
        contentType: file.type,
        status: {
          type: "running",
          progress: event.value,
          reason: "uploading",
        },
      };
    }
  },
  async remove(attachment: Attachment) {
    // noop
  },
  async send(attachment: PendingAttachment) {
    const id = fileIdMap[attachment.id] || attachment.id;
    delete fileIdMap[attachment.id];
    return {
      ...attachment,
      id,
      status: { type: "complete" },
      content: [
        {
          type: "file",
          mimeType: attachment.contentType,
          filename: attachment.name,
          data: "",
        },
      ],
    };
  },
};
