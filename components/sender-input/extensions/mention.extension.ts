import Mention from "@tiptap/extension-mention";
import { ReactRenderer } from "@tiptap/react";
import tippy, { Instance as TippyInstance } from "tippy.js";
import {
  MentionExtensionOptions,
  SenderInputSkillItem,
  SkillListInstance,
} from "../types";

/**
 * 创建 Mention 扩展
 */
export const createMentionExtension = (params: MentionExtensionOptions) => {
  const {
    trigger,
    name,
    options,
    skillReferenceSelector,
    renderSkillList: SkillList,
    onSkillPopupVisibilityChange,
    mentionLabelClassName,
  } = params;
  const MentionExt = name ? Mention.extend({ name }) : Mention;

  const mentionExtension = MentionExt.configure({
    HTMLAttributes: {
      class: "mention",
    },
    // 确保文本表示使用 label
    renderText({ node }) {
      return node.attrs.label;
    },
    // 自定义 HTML 渲染（编辑器内显示）
    renderHTML({ node }) {
      // 组合 className：基础类 + 自定义类
      const className = mentionLabelClassName
        ? `mention ${mentionLabelClassName}`
        : "mention";

      return [
        "span",
        {
          class: className,
          "data-type": node.attrs["data-type"],
          "data-id": node.attrs.id,
        },
        node.attrs.label,
      ];
    },
    suggestion: {
      char: trigger,
      allowSpaces: false,
      allowedPrefixes: null,
      items: () => options || [],
      render: () => {
        let component: ReactRenderer<SkillListInstance> | undefined;
        let popup: TippyInstance[] | undefined;
        return {
          onStart: (props) => {
            // 获取当前编辑器中已选中的技能 ID
            const selectedIds = new Set<string | number>();
            props.editor.state.doc.descendants((node) => {
              if (node.type.name === name || node.type.name === "mention") {
                selectedIds.add(node.attrs.id);
              }
            });

            component = new ReactRenderer(SkillList!, {
              props: { ...props, selectedIds },
              editor: props.editor,
            });
            // 触发显示状态回调
            onSkillPopupVisibilityChange?.(true);
            // 如果提供了 skillReferenceSelector，使用指定元素作为定位参考
            const referenceElement = skillReferenceSelector
              ? document.querySelector(skillReferenceSelector)
              : null;
            popup = tippy("body", {
              content: component.element,
              showOnCreate: true,
              interactive: true,
              trigger: "manual",
              placement: referenceElement ? "top-start" : "bottom-start", // 固定元素在上方，光标在下方
              arrow: false, // 隐藏箭头
              offset: [0, referenceElement ? 12 : 8], // 固定元素距离12px，光标距离8px
              maxWidth: "none", // 取消最大宽度限制
              appendTo: () => document.body,
              getReferenceClientRect: () => {
                // 如果找到了参考元素，使用它的位置
                if (referenceElement) {
                  return referenceElement.getBoundingClientRect();
                }
                // 否则使用光标位置
                return props.clientRect?.() || new DOMRect();
              },
              // 监听 tippy 隐藏事件（包括点击外部、Esc等所有隐藏情况）
              onHide: () => {
                onSkillPopupVisibilityChange?.(false);
              },
            });
          },
          onUpdate(props) {
            // 更新已选中的 ID 列表
            const selectedIds = new Set<string | number>();
            props.editor.state.doc.descendants((node) => {
              if (node.type.name === name || node.type.name === "mention") {
                selectedIds.add(node.attrs.id);
              }
            });
            component?.updateProps({ ...props, selectedIds });
          },
          onKeyDown: (props) => {
            if (props.event?.key === "Escape") {
              popup?.[0]?.hide();
              return true;
            }
            return component?.ref?.onKeyDown(props.event) || false;
          },
          onExit: () => {
            popup?.[0]?.destroy();
            component?.destroy();
            // onExit 时不再触发回调，因为 tippy 的 onHide 已经处理了
          },
        };
      },
      command({ editor, range, props }) {
        // 删除触发字符和查询文本,然后插入 mention
        const item = props as unknown as SenderInputSkillItem;
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
  return mentionExtension;
};
