import { useSmartVisionChatReferenceStore } from "@/runtime/smartVisionReferenceRuntime";

export const ReferencePrimitiveContent = () => {
  const text = useSmartVisionChatReferenceStore((s) => s.reference);
  return <>{text}</>;
};
