"use client";

import { type FC, useCallback, useMemo, useRef } from "react";
import { useAssistantApi, useAssistantState } from "@assistant-ui/react";
import {
  useSmartVisionConfigStore,
  useSmartVisionConfigActions,
} from "@/runtime/smartVisionConfigRuntime";
import { Sender, type SenderRef } from "../../sender";
import type { SuggestionItem } from "../../sender/types";
import { AgentConfig } from "@/runtime/types";

// 业务相关的 SuggestionItem 类型（包含额外的业务字段）
export type BusinessSuggestionItem = SuggestionItem & {
  type?: "tool" | "workflow" | "mcp";
  description?: string;
  icon?: string;
};

/**
 * SenderInput - assistant-ui 业务组件
 * 负责连接 Sender 和 @assistant-ui/react 的状态管理
 */
export const SenderInput: FC = () => {
  const api = useAssistantApi();
  const { syncSelectedAgents } = useSmartVisionConfigActions();
  const senderRef = useRef<SenderRef>(null);

  // 从 store 获取原始配置数据
  const mcpServers = useSmartVisionConfigStore(
    (s) => s?.config?.agent_mode?.mcp_servers,
  );
  const toolsets = useSmartVisionConfigStore(
    (s) => s?.config?.agent_mode?.toolsets,
  );
  const workflows = useSmartVisionConfigStore(
    (s) => s?.config?.agent_mode?.workflows,
  );

  // 使用 useMemo 缓存转换结果，避免无限循环
  const businessSuggestionDataProvider = useMemo(() => {
    return [
      ...buildSuggestionList(mcpServers || [], "mcp"),
      ...buildSuggestionList(toolsets || [], "tool"),
      ...buildSuggestionList(workflows || [], "workflow"),
    ];
  }, [mcpServers, toolsets, workflows]);
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
    [api],
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
          ".aui-composer-root form, form.aui-composer-root",
        );
        if (formElement instanceof HTMLFormElement) {
          formElement.requestSubmit();
        }
      }, 0);

      return true; // 允许清空编辑器
    },
    [api],
  );

  // Mention 标签变化时的回调 - 收集并同步所有 agents
  const handleMentionsChange = useCallback(
    (mentions: SuggestionItem[]) => {
      // 收集完整的原始数据（通过 id 查找确定类型）
      const selectedMcpServers: string[] = [];
      const selectedToolsets: string[] = [];
      const selectedWorkflows: string[] = [];

      mentions.forEach((mention) => {
        const id = mention.value;

        // 在三个数据源中查找匹配的配置
        const mcpServer = (mcpServers || []).find((server) => server.id === id);
        if (mcpServer) {
          selectedMcpServers.push(mcpServer.id);
          return;
        }

        const toolset = (toolsets || []).find((tool) => tool.id === id);
        if (toolset) {
          selectedToolsets.push(toolset.id);
          return;
        }

        const workflow = (workflows || []).find((wf) => wf.id === id);
        if (workflow) {
          selectedWorkflows.push(workflow.id);
          return;
        }
      });
      // 同步完整数据到 store
      syncSelectedAgents(
        selectedToolsets,
        selectedMcpServers,
        selectedWorkflows,
      );
    },
    [syncSelectedAgents, mcpServers, toolsets, workflows],
  );

  return (
    <>
      {/* <div
        onClick={(e) => {
          senderRef.current?.openSuggestion();
        }}
      >
        打开命令菜单
      </div> */}
      <Sender
        ref={senderRef}
        value={value}
        onChange={handleChange}
        onMentionsChange={handleMentionsChange}
        onSubmit={handleSubmit}
        disabled={disabled}
        autoFocus={true}
        suggestionDataProvider={businessSuggestionDataProvider}
        // 🔧 自定义建议列表浮窗（取消注释即可使用）
        renderSuggestionList={CustomSuggestionList}
        referenceSelector=".aui-composer-root"
        // 🔧 自定义 mention 标签样式（注意：受 Tiptap renderHTML 限制）
        // renderMentionLabel={(item) => <span style={{...}}>{item.label}</span>}
      />
    </>
  );
};

/**
 * 构建业务相关的 SuggestionItem 数据
 * @param configs - 配置数据
 * @param type - 类型
 * @returns SuggestionItem[]
 */
function buildSuggestionList(configs: AgentConfig[], type: string) {
  return configs.map((cfg) => ({
    value: cfg.id,
    label: cfg.name,
    type,
    avatar: cfg.avatar,
  }));
}

/**
 * 自定义建议列表组件示例
 * 用户可以在 SenderInput.tsx 中使用这个组件来完全自定义浮窗样式
 */
export function CustomSuggestionList({
  items,
  command,
}: {
  items: SuggestionItem[];
  command: (item: SuggestionItem) => void;
}) {
  if (items.length === 0) {
    return (
      <div style={{ padding: "16px", color: "#999" }}>没有找到匹配的结果</div>
    );
  }

  return (
    <div
      style={{
        background: "white",
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        padding: "8px",
        minWidth: "280px",
        color: "black",
      }}
    >
      {items.map((item) => (
        <button
          key={item.value}
          onClick={() => command(item)}
          style={{
            display: "block",
            width: "100%",
            padding: "12px",
            border: "none",
            background: "transparent",
            textAlign: "left",
            cursor: "pointer",
            borderRadius: "4px",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f5f5f5";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          {/* 使用 renderLabel 如果有，否则使用 label */}
          {item.renderLabel || (
            <div>
              <div style={{ fontWeight: "500" }}>{item.label}</div>
              <div
                style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}
              >
                ID: {item.value}
              </div>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
