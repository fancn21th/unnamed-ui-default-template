import StarterKit from "@tiptap/starter-kit";
import type { SuggestionDataProvider, SuggestionItem } from "../types";
import { createMentionExtension, type SuggestionListRef } from "./mention";
import { SuggestionList, type SuggestionListProps } from "../suggestions/SuggestionList";

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
}

/**
 * 创建编辑器扩展列表
 */
export const createEditorExtensions = (options?: EditorExtensionsOptions) => {
  const { suggestionDataProvider, onSuggestionSelect, renderMentionLabel, renderSuggestionList } = options || {};

  return [
    // 基础功能扩展
    StarterKit.configure({
      heading: false,
      codeBlock: false,
      horizontalRule: false,
      blockquote: false,
    }),

    // "/" 触发的 Mention
    createMentionExtension({
      trigger: "/",
      suggestionDataProvider,
      onSuggestionSelect,
      renderMentionLabel,
      suggestionListComponent: renderSuggestionList || TypedSuggestionList,
    }),

    // "@" 触发的 Mention
    createMentionExtension({
      trigger: "@",
      name: "atMention",
      suggestionDataProvider,
      onSuggestionSelect,
      renderMentionLabel,
      suggestionListComponent: renderSuggestionList || TypedSuggestionList,
    }),
  ];
};
