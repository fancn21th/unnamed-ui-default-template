import Placeholder from "@tiptap/extension-placeholder";
/**
 * 创建Placeholder扩展
 */
export function createPlaceholderExtension(placeholderText: string) {
  return Placeholder.configure({
    placeholder: placeholderText,
  });
}
