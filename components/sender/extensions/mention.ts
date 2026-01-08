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
 * Mention 节点属性（Tiptap Mention 扩展使用的格式）
 */
interface MentionNodeAttrs {
  id: string | null;
  label?: string | null;
}

/**
 * Tiptap Suggestion props 类型（用于 onStart 和 onUpdate）
 */
interface TiptapSuggestionProps {
  editor: Editor;
  range: Range;
  query: string;
  text: string;
  items: SuggestionItem[];
  command: (props: MentionNodeAttrs) => void;
  decorationNode: Element | null;
  clientRect?: (() => DOMRect | null) | null;
  event?: KeyboardEvent;
}

/**
 * Tiptap Suggestion KeyDown props 类型（只包含 event）
 */
interface TiptapSuggestionKeyDownProps {
  event?: KeyboardEvent;
}

/**
 * Tiptap command 函数参数类型
 */
interface TiptapCommandProps {
  editor: Editor;
  range: Range;
  props: MentionNodeAttrs;
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
  suggestionListComponent: React.ComponentType<{
    items: SuggestionItem[];
    command: (item: SuggestionItem) => void;
  }>;
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
        // 调用自定义渲染函数（虽然结果不会直接使用，但保持接口一致性）
        renderMentionLabel(item);

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

        const renderResult = {
          onStart: (props: TiptapSuggestionProps) => {
            // 转换 props 以匹配组件期望的格式
            const componentProps = {
              items: props.items,
              command: (item: SuggestionItem) => {
                // 调用 Tiptap 的 command，传入符合 MentionNodeAttrs 格式的对象
                // 将 value 转换为 string，因为 Tiptap 的 id 是 string | null
                props.command({
                  id: String(item.value),
                  label: item.label,
                });
              },
            };

            component = new ReactRenderer(SuggestionListComponent, {
              props: componentProps,
              editor: props.editor,
            });

            if (!props.clientRect) {
              return;
            }

            popup = tippy("body", {
              getReferenceClientRect: props.clientRect as () => DOMRect,
              appendTo: () => document.body,
              content: component.element,
              showOnCreate: true,
              interactive: true,
              trigger: "manual",
              placement: "bottom-start",
            });
          },

          onUpdate: (props: TiptapSuggestionProps) => {
            // 转换 props 以匹配组件期望的格式
            const componentProps = {
              items: props.items,
              command: (item: SuggestionItem) => {
                // 调用 Tiptap 的 command，传入符合 MentionNodeAttrs 格式的对象
                // 将 value 转换为 string，因为 Tiptap 的 id 是 string | null
                props.command({
                  id: String(item.value),
                  label: item.label,
                });
              },
            };
            component?.updateProps(componentProps);

            if (!props.clientRect) {
              return;
            }

            popup?.[0]?.setProps({
              getReferenceClientRect: props.clientRect as () => DOMRect,
            });
          },

          onKeyDown: (props: TiptapSuggestionKeyDownProps) => {
            if (props.event?.key === "Escape") {
              popup?.[0]?.hide();
              return true;
            }

            if (props.event) {
              return component?.ref?.onKeyDown(props.event) || false;
            }
            return false;
          },

          onExit: () => {
            popup?.[0]?.destroy();
            component?.destroy();
          },
        };
        return renderResult;
      },
      command: ({ editor, range, props }: TiptapCommandProps) => {
        // 处理 Tiptap 传递的 props（MentionNodeAttrs 格式）
        // Tiptap 传递的 props 包含 id 和 label，我们需要转换为 SuggestionItem 格式
        const item: SuggestionItem = {
          value: props.id ?? "",
          label: props.label ?? "",
        };

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
