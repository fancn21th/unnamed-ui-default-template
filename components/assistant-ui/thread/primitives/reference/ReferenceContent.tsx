import { useSmartVisionChatReferenceStore } from "@/runtime/smartVisionChatReferenceLink";

export const ReferencePrimitiveContent = () => {
  const text = useSmartVisionChatReferenceStore((s) => s.use);
  return <>{text}</>;
};
