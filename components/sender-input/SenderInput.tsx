import { useEffect, useImperativeHandle, forwardRef } from "react";
import { useEditor, EditorContent, EditorEvents } from "@tiptap/react";
import { EditorView } from "@tiptap/pm/view";
import { DefaultSkillList } from "./components/SkillList";
import {
  StarterKitExtension,
  createPlaceholderExtension,
  createMentionExtension,
} from "./extensions";
import type {
  SenderInputProps,
  SenderInputInstance,
  SenderInputSkillItem,
} from "./types";

/**
 * 输入框组件
 */
export const SenderInput = forwardRef<SenderInputInstance, SenderInputProps>(
  (props, ref) => {
    const {
      autoFocus,
      disabled,
      value = "",
      className = "",
      placeholder = "",
      skillTriggerString = "/",
      skillList = [],
      skillReferenceSelector = "",
      renderSkillList = DefaultSkillList,
      mentionLabelClassName,
      onSubmit,
      onChange,
      onSkillsChange,
      onSkillPopupVisibilityChange,
    } = props;
    // 编辑器实例
    const editor = useEditor(
      {
        immediatelyRender: false,
        editable: !disabled,
        extensions: [
          StarterKitExtension,
          createPlaceholderExtension(placeholder),
          createMentionExtension({
            trigger: skillTriggerString,
            options: skillList || [],
            skillReferenceSelector,
            renderSkillList,
            onSkillPopupVisibilityChange,
            mentionLabelClassName,
          }),
        ],
        content: value,
        autofocus: autoFocus && !disabled,
        editorProps: {
          attributes: {
            class: `tiptap-placeholder tiptap-mention ${className}`,
            "aria-label": "Sender input",
          },
          handleKeyDown: onHandleKeyDown,
        },
        onUpdate: onEditorUpdate,
      },
      [skillList],
    );

    // 同步外部 value 到编辑器
    useEffect(() => {
      if (editor && value !== editor.getText()) {
        editor.commands.setContent(value);
      }
    }, [value, editor]);

    // 同步禁用状态
    useEffect(() => {
      if (editor) {
        editor.setEditable(!disabled);
      }
    }, [disabled, editor]);

    // 暴露方法给外部调用
    useImperativeHandle(
      ref,
      () => ({
        openSkill: (trigger = "/") => {
          if (!editor) return;
          // 聚焦编辑器
          editor.commands.focus();
          // 在光标位置插入触发字符，这会自动触发 suggestion
          editor.commands.insertContent(trigger);
        },
      }),
      [editor],
    );

    /**
     * 处理键盘按下事件
     */
    function onHandleKeyDown(view: EditorView, event: KeyboardEvent) {
      // Enter 键提交，Shift+Enter 换行
      if (event.key === "Enter" && !event.shiftKey && !disabled) {
        event.preventDefault();
        // 从 view.state 获取当前文本内容
        const text = view.state.doc.textContent;
        if (text.trim() && onSubmit) {
          const shouldContinue = onSubmit(text);
          // 如果 onSubmit 返回 false，则不清空编辑器
          if (shouldContinue !== false) {
            editor?.commands.clearContent();
          }
        }
        return true;
      }
      return false;
    }

    /**
     * 监听编辑器更新事件
     */
    function onEditorUpdate({ editor }: EditorEvents["update"]) {
      const text = editor.getText();
      onChange?.(text);

      // 提取当前编辑器中的所有 mention 节点
      if (onSkillsChange) {
        const skills: SenderInputSkillItem[] = [];
        editor.state.doc.descendants((node) => {
          if (
            node.type.name === "mention" ||
            node.type.name === "slashMention"
          ) {
            skills.push({
              value: node.attrs.id,
              label: node.attrs.label,
            });
          }
        });
        onSkillsChange(skills);
      }
    }

    if (!editor) {
      return null;
    }
    return <EditorContent editor={editor} />;
  },
);
SenderInput.displayName = "SenderInput";
