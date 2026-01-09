import Mention from "@tiptap/extension-mention";
import { ReactRenderer } from "@tiptap/react";
import tippy, { Instance as TippyInstance } from "tippy.js";
import type { Editor } from "@tiptap/react";
import type { SuggestionDataProvider, SuggestionItem } from "../types";

/**
 * Range 类型定义（ProseMirror range）
 */
interface Range {
  from: number;
  to: number;
}

/**
 * Suggestion props 接口（来自 Tiptap suggestion 插件）
 */
interface SuggestionProps<T = SuggestionItem> {
  editor: Editor;
  range: Range;
  query: string;
  text: string;
  items: T[];
  command: (props: T) => void;
  decorationNode: Element | null;
  clientRect?: (() => DOMRect | null) | null;
  event?: KeyboardEvent;
}

/**
 * Mention 扩展所需的建议列表组件 ref 接口
 */
export interface SuggestionListRef {
  onKeyDown: (event: KeyboardEvent) => boolean;
}

/**
 * Mention 扩展配置选项
 */
export interface MentionExtensionOptions {
  /**
   * 触发字符（如 "/" 或 "@"）
   */
  trigger: string;
  /**
   * 扩展名称（用于区分多个 Mention 实例）
   */
  name?: string;
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
   * 建议列表组件（React 组件）
   */
  suggestionListComponent: React.ComponentType<any>;
  /**
   * 浮窗定位参考元素的选择器（可选）
   * 默认为光标位置，如果设置则固定在指定元素上方
   */
  referenceSelector?: string;
}

/**
 * 创建 Mention 扩展
 */
export const createMentionExtension = (options: MentionExtensionOptions) => {
  const {
    trigger,
    name,
    suggestionDataProvider,
    onSuggestionSelect,
    renderMentionLabel,
    suggestionListComponent: SuggestionListComponent,
    referenceSelector,
  } = options;

  const MentionExt = name ? Mention.extend({ name }) : Mention;

  return MentionExt.configure({
    HTMLAttributes: {
      class: "mention",
    },
    // 自定义 HTML 渲染
    renderHTML({ node }) {
      // 如果提供了自定义渲染函数，使用自定义渲染
      if (renderMentionLabel) {
        const item: SuggestionItem = {
          value: node.attrs.id,
          label: node.attrs.label,
        };
        const customContent = renderMentionLabel(item);

        // 如果是 React 元素，需要转换为字符串或使用默认显示
        // 这里我们仍然使用 label，但可以添加额外的 class
        return [
          "span",
          {
            class: "mention mention-custom",
            "data-type": node.attrs["data-type"],
            "data-id": node.attrs.id,
          },
          node.attrs.label, // Tiptap 的 renderHTML 只能返回纯文本
        ];
      }

      // 默认渲染
      return [
        "span",
        {
          class: "mention",
          "data-type": node.attrs["data-type"],
          "data-id": node.attrs.id,
        },
        node.attrs.label,
      ];
    },
    // 确保文本表示使用 label
    renderText({ node }) {
      return node.attrs.label;
    },
    suggestion: {
      char: trigger,
      allowSpaces: false,
      // 允许在任何字符后触发（包括紧跟文本）
      allowedPrefixes: null,
      items: async ({ query }: { query: string }) => {
        if (!suggestionDataProvider) return [];

        // 如果是数组，直接过滤
        if (Array.isArray(suggestionDataProvider)) {
          const searchText = query.toLowerCase();

          // 如果没有查询文本，返回所有项
          if (!searchText) {
            return suggestionDataProvider;
          }

          const filtered = suggestionDataProvider.filter((item) => {
            return (
              item.label.toLowerCase().includes(searchText) ||
              String(item.value).toLowerCase().includes(searchText) ||
              item.type?.toLowerCase().includes(searchText)
            );
          });
          return filtered;
        }

        // 如果是函数，调用函数获取数据
        const items = await suggestionDataProvider(query, trigger);
        return items;
      },
      render: () => {
        let component: ReactRenderer<SuggestionListRef> | undefined;
        let popup: TippyInstance[] | undefined;

        return {
          onStart: (props: any) => {
            component = new ReactRenderer(SuggestionListComponent, {
              props,
              editor: props.editor,
            });

            // 如果提供了 referenceSelector，使用指定元素作为定位参考
            const referenceElement = referenceSelector
              ? document.querySelector(referenceSelector)
              : null;
            popup = tippy("body", {
              getReferenceClientRect: () => {
                // 如果找到了参考元素，使用它的位置
                if (referenceElement) {
                  return referenceElement.getBoundingClientRect();
                }
                // 否则使用光标位置
                return props.clientRect ? props.clientRect() : new DOMRect();
              },
              appendTo: () => document.body,
              content: component.element,
              showOnCreate: true,
              interactive: true,
              trigger: "manual",
              placement: referenceElement ? "top-start" : "bottom-start", // 固定元素在上方，光标在下方
              arrow: false, // 隐藏箭头
              offset: [0, referenceElement ? 12 : 8], // 固定元素距离12px，光标距离8px
              maxWidth: "none", // 取消最大宽度限制
            });
          },

          onUpdate: (props: any) => {
            component?.updateProps(props);

            // 不需要更新位置，因为固定在 composer-root 上方
          },

          onKeyDown: (props: any) => {
            if (props.event?.key === "Escape") {
              popup?.[0]?.hide();
              return true;
            }

            return component?.ref?.onKeyDown(props.event) || false;
          },

          onExit: () => {
            popup?.[0]?.destroy();
            component?.destroy();
          },
        };
      },
      command: ({ editor, range, props }: any) => {
        const item = props as SuggestionItem;

        onSuggestionSelect?.(item);

        // 删除触发字符和查询文本,然后插入 mention
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .insertContent([
            {
              type: name || "mention",
              attrs: {
                id: item.value,
                label: item.label,
              },
            },
            {
              type: "text",
              text: " ",
            },
          ])
          .run();
      },
    },
  });
};
