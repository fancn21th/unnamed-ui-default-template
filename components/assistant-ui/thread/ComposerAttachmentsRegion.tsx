import type { FC } from "react";
import {
  useAssistantState,
} from "@assistant-ui/react";
import {
  SenderRegion,
} from "@/components/wuhan/blocks/sender-01";
import { useShallow } from "zustand/shallow";
import { ComposerAttachments } from "@/components/assistant-ui/attachment";

export const ComposerAttachmentsRegion: FC = () => {
  const hasAttachments = useAssistantState(
    useShallow(({ composer }) => {
      const attachments = composer.attachments;
      return attachments && attachments.length > 0;
    }),
  );

  if (!hasAttachments) return null;

  return (
    <SenderRegion className="py-0">
      <ComposerAttachments />
    </SenderRegion>
  );
};