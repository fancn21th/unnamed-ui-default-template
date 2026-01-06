"use client";

import { type FC, useCallback } from "react";
import { useAssistantApi, useAssistantState } from "@assistant-ui/react";
import { Sender } from "./Sender";

/**
 * Sender 组件的 assistant-ui 适配器
 * 负责连接 Sender 和 @assistant-ui/react 的状态管理
 */
export const SenderAdapter: FC = () => {
  const api = useAssistantApi();
  
  // 从 composer 读取当前文本
  const value = useAssistantState(({ composer }) => {
    if (!composer.isEditing) return "";
    return composer.text;
  });

  // 从 thread 读取禁用状态
  const disabled = useAssistantState(({ thread }) => thread.isDisabled);

  // 文本变化时同步到 composer
  const handleChange = useCallback(
    (text: string) => {
      if (api.composer().getState().isEditing) {
        api.composer().setText(text);
      }
    },
    [api]
  );

  // 提交时触发表单提交
  const handleSubmit = useCallback(
    (text: string) => {
      const isRunning = api.thread().getState().isRunning;
      if (isRunning || !text.trim()) return false;

      // 找到最近的表单元素并提交
      // 这里使用 setTimeout 确保状态已更新
      setTimeout(() => {
        const formElement = document.querySelector(
          '.aui-composer-root form, form.aui-composer-root'
        );
        if (formElement instanceof HTMLFormElement) {
          formElement.requestSubmit();
        }
      }, 0);

      return true; // 允许清空编辑器
    },
    [api]
  );

  return (
    <Sender
      value={value}
      onChange={handleChange}
      onSubmit={handleSubmit}
      disabled={disabled}
      autoFocus={true}
    />
  );
};
