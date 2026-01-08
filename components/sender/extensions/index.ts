import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import type { SuggestionDataProvider, SuggestionItem } from "../types";
import { createMentionExtension, type SuggestionListRef } from "./mention";
import {
  SuggestionList,
  type SuggestionListProps,
} from "../suggestions/SuggestionList";

// 确保 SuggestionList 符合 SuggestionListRef 接口
const TypedSuggestionList = SuggestionList as React.ForwardRefExoticComponent<
  SuggestionListProps & React.RefAttributes<SuggestionListRef>
>;

/**
 * 编辑器扩展配置选项
 */
export interface EditorExtensionsOptions {
  /**
   * 建议数据提供者
   */
  suggestionDataProvider?: SuggestionDataProvider;
  /**
   * 选择建议项时的回调
   */
  onSuggestionSelect?: (item: SuggestionItem) => void;
  /**
   * 自定义 mention 标签渲染函数
   */
  renderMentionLabel?: (item: SuggestionItem) => React.ReactNode;
  /**
   * 自定义建议列表渲染组件
   */
  renderSuggestionList?: React.ComponentType<{
    items: SuggestionItem[];
    command: (item: SuggestionItem) => void;
  }>;
  /**
   * 占位符文本
   */
  placeholder?: string;
  /**
   * 浮窗定位参考元素的选择器
   */
  referenceSelector?: string;
}

/**
 * 创建编辑器扩展列表
 */
export const createEditorExtensions = (options?: EditorExtensionsOptions) => {
  const {
    suggestionDataProvider,
    onSuggestionSelect,
    renderMentionLabel,
    renderSuggestionList,
    placeholder,
    referenceSelector,
  } = options || {};

  return [
    // 基础功能扩展
    StarterKit.configure({
      heading: false,
      codeBlock: false,
      horizontalRule: false,
      blockquote: false,
    }),

    // Placeholder 扩展
    Placeholder.configure({
      placeholder: placeholder || "Send a message...",
    }),

    // "/" 触发的 Mention
    createMentionExtension({
      trigger: "/",
      suggestionDataProvider,
      onSuggestionSelect,
      renderMentionLabel,
      suggestionListComponent: renderSuggestionList || TypedSuggestionList,
      referenceSelector,
    }),

    // "@" 触发的 Mention
    createMentionExtension({
      trigger: "@",
      name: "atMention",
      suggestionDataProvider,
      onSuggestionSelect,
      renderMentionLabel,
      suggestionListComponent: renderSuggestionList || TypedSuggestionList,
      referenceSelector,
    }),
  ];
};
