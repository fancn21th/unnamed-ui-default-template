import { useCallback, useEffect, useMemo, useRef } from "react";
import { useAssistantApi, useAssistantState } from "@assistant-ui/react";

import {
  useSmartVisionConfigStore,
  useSmartVisionConfigActions,
} from "@/runtime/smartVisionConfigRuntime";

import {
  type SenderInputSkillItem,
  type SenderInputInstance,
} from "../components/sender-input";
import { SkillConfig } from "./types";

/**
 * 聊天输入框运行时逻辑
 */
export function useChatSenderInputRuntime() {
  const api = useAssistantApi();
  const inputRef = useRef<SenderInputInstance>(null);
  const { setSelectedSkills, setOpenSkillsFn, onSkillVisibleChange } =
    useSmartVisionConfigActions();
  // 从 composer 读取当前文本
  const value = useAssistantState(({ composer }) => {
    if (!composer.isEditing) return "";
    return composer.text;
  });

  // 从 thread 读取禁用状态
  const disabled = useAssistantState(({ thread }) => thread.isDisabled);

  const { skillOptions, getSkillsByIds } = useSkillList();

  /**
   * 将 openSkill 方法注册到全局 store，供其他组件调用
   */
  useEffect(() => {
    if (inputRef.current?.openSkill) {
      // 包装成箭头函数，延迟调用
      setOpenSkillsFn(() => {
        inputRef.current?.openSkill();
      });
    }
    return () => {
      setOpenSkillsFn(() => {});
    };
  }, [setOpenSkillsFn]);

  /**
   * 输入变化时的回调
   */
  const onInputChange = useCallback(
    (text: string) => {
      if (api.composer().getState().isEditing) {
        api.composer().setText(text);
      }
    },
    [api],
  );

  /**
   * 提交时的回调
   */
  const onInputSubmit = useCallback(
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

  /**
   * 技能变化时的回调
   * @param skills
   */
  const onSkillsChange = (skills: SenderInputSkillItem[]) => {
    const skillIds = skills.map((skill) => Number(skill.value));
    const categorizedSkills = getSkillsByIds(skillIds);
    setSelectedSkills(
      categorizedSkills.toolsets,
      categorizedSkills.mcp_servers,
      categorizedSkills.workflows,
    );
  };

  /**
   * 技能浮窗显示/隐藏状态变化时的回调
   * @param visible 
   */
  const onSkillPopupVisibilityChange = (visible: boolean) => {
    onSkillVisibleChange(visible);
  };

  return {
    value,
    disabled,
    skillOptions,
    inputRef,
    onInputChange,
    onInputSubmit,
    onSkillsChange,
    onSkillPopupVisibilityChange,
  };
}

/**
 * 技能分类数据类型
 */
export interface CategorizedSkills {
  mcp_servers: SkillConfig[];
  workflows: SkillConfig[];
  toolsets: SkillConfig[];
}

/**
 * 技能列表hook
 */
export function useSkillList() {
  /**
   * 构建业务相关的 SuggestionItem 数据
   * @param configs - 配置数据
   * @param type - 类型
   * @returns SuggestionItem[]
   */
  function buildSuggestionList(configs: SkillConfig[], type: string) {
    return configs.map((cfg) => ({
      value: cfg.id,
      label: cfg.name,
      avatar: cfg.avatar,
      type,
    }));
  }

  // 直接获取原始数据（稳定引用）
  const agentMode = useSmartVisionConfigStore((s) => s?.config?.agent_mode);

  // 使用 useMemo 缓存计算结果
  const { skillOptions, rawData } = useMemo(() => {
    if (agentMode) {
      const { mcp_servers, workflows, toolsets } = agentMode;

      // 类型映射：数据源 key -> 显示的 type 名称
      const typeMap = {
        mcp_servers: "mcp",
        workflows: "workflow",
        toolsets: "tool",
      } as const;

      const skillTypes = { mcp_servers, workflows, toolsets };
      const skillOptions = Object.entries(skillTypes).flatMap(
        ([key, configs]) =>
          buildSuggestionList(
            configs || [],
            typeMap[key as keyof typeof typeMap],
          ),
      );

      return {
        skillOptions,
        rawData: {
          mcp_servers: mcp_servers || [],
          workflows: workflows || [],
          toolsets: toolsets || [],
        },
      };
    }
    return {
      skillOptions: [],
      rawData: {
        mcp_servers: [],
        workflows: [],
        toolsets: [],
      },
    };
  }, [agentMode]);

  /**
   * 根据 id 列表获取原始分类数据
   * @param ids - id 列表
   * @returns 分类后的原始数据对象
   */
  const getSkillsByIds = useCallback(
    (ids: (string | number)[]): CategorizedSkills => {
      const idSet = new Set(ids);

      return {
        mcp_servers: rawData.mcp_servers.filter((item) => idSet.has(item.id)),
        workflows: rawData.workflows.filter((item) => idSet.has(item.id)),
        toolsets: rawData.toolsets.filter((item) => idSet.has(item.id)),
      };
    },
    [rawData],
  );

  return {
    skillOptions,
    getSkillsByIds,
  };
}
