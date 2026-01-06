"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, type FC } from "react";
import type { SenderProps } from "./types";
import "./sender.css";

/**
 * Tiptap 富文本输入组件
 * 独立组件，可用于任何项目
 */
export const Sender: FC<SenderProps> = ({
  value = "",
  onChange,
  onSubmit,
  disabled = false,
  autoFocus = true,
  placeholder = "Send a message...",
  className,
}) => {
  const editor = useEditor({
    immediatelyRender: false,
    editable: !disabled,
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        horizontalRule: false,
        blockquote: false,
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          className ||
          "aui-composer-input mb-1 max-h-32 min-h-16 w-full resize-none bg-transparent px-3.5 pt-1.5 pb-3 text-base outline-none placeholder:text-muted-foreground focus:outline-primary prose prose-sm max-w-none",
        "aria-label": "Message input",
      },
      handleKeyDown: (view, event) => {
        // Enter 键提交，Shift+Enter 换行
        if (event.key === "Enter" && !event.shiftKey && !disabled) {
          event.preventDefault();
          const text = editor?.getText() || "";
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
    },
    autofocus: autoFocus && !disabled,
  });

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

  if (!editor) {
    return null;
  }

  return (
    <div className="tiptap-wrapper">
      <EditorContent editor={editor} />
    </div>
  );
};
