"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { useEffect, useImperativeHandle, forwardRef } from "react";
import type { SenderProps, SenderRef, SuggestionItem } from "./types";
import { createEditorExtensions } from "./extensions";
import "tippy.js/dist/tippy.css";
import "./styles/sender.css";
import "./styles/suggestion.css";

/**
 * Tiptap 富文本输入组件
 * 独立组件，可用于任何项目
 */
export const Sender = forwardRef<SenderRef, SenderProps>(({
  value = "",
  onChange,
  onMentionsChange,
  onSubmit,
  disabled = false,
  autoFocus = true,
  placeholder = "Send a message...",
  className,
  suggestionDataProvider,
  onSuggestionSelect,
  renderMentionLabel,
  renderSuggestionList,
  referenceSelector,
}, ref) => {
  const editor = useEditor({
    immediatelyRender: false,
    editable: !disabled,
    extensions: createEditorExtensions({
      suggestionDataProvider,
      onSuggestionSelect,
      renderMentionLabel,
      renderSuggestionList,
      placeholder,
      referenceSelector,
    }),
    content: value,
    editorProps: {
      attributes: {
        class:
          className ||
          "aui-composer-input mb-1 max-h-32 min-h-16 w-full resize-none bg-transparent px-3.5 pt-1.5 pb-3 text-base outline-none placeholder:text-muted-foreground focus:outline-primary prose prose-sm max-w-none",
        "aria-label": "Message input",
        placeholder: placeholder,
      },
      handleKeyDown: (view, event) => {
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
      },
    },
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      onChange?.(text);
      
      // 提取当前编辑器中的所有 mention 节点
      if (onMentionsChange) {
        const mentions: SuggestionItem[] = [];
        editor.state.doc.descendants((node) => {
          if (node.type.name === "mention" || node.type.name === "slashMention") {
            mentions.push({
              value: node.attrs.id,
              label: node.attrs.label,
            });
          }
        });
        onMentionsChange(mentions);
      }
    },
    autofocus: autoFocus && !disabled,
  }, [suggestionDataProvider, renderMentionLabel, renderSuggestionList]); // 添加依赖项，数据变化时重新创建编辑器

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
  useImperativeHandle(ref, () => ({
    openSuggestion: (trigger = "/") => {
      if (!editor) return;
      
      // 聚焦编辑器
      editor.commands.focus();
      
      // 在光标位置插入触发字符，这会自动触发 suggestion
      editor.commands.insertContent(trigger);
    },
    getEditor: () => editor,
    focus: () => {
      editor?.commands.focus();
    },
  }), [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="tiptap-wrapper">
      <EditorContent editor={editor} />
    </div>
  );
});

Sender.displayName = "Sender";
