import type { FC, PropsWithChildren } from "react";
import { useAssistantState } from "@assistant-ui/react";
import { useShallow } from "zustand/shallow";
import { useSmartVisionChatReferenceStore } from "@/runtime/smartVisionReferenceRuntime";

export type Props = PropsWithChildren<{
  hasReference?: boolean;
  hasAttachments?: boolean;
}>;
export const ComposerHeaderPrimitiveAnyIf: FC<Props> = ({
  hasReference,
  hasAttachments,
  children,
}) => {
  const has_attachments = useAssistantState(
    useShallow(({ composer }) => {
      const attachments = composer.attachments;
      return attachments && attachments.length > 0;
    }),
  );
  const has_reference = useSmartVisionChatReferenceStore((s) => {
    return !!s.reference;
  });
  if (hasReference != undefined || hasAttachments != undefined) {
    if (hasReference === has_reference || hasAttachments === has_attachments) {
      return <>{children}</>;
    }
  }
  return null;
};
ComposerHeaderPrimitiveAnyIf.displayName = "ComposerHeaderPrimitiveAnyIf";
