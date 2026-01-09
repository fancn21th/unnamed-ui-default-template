import { loadConfig, getApp } from "@/runtime/smartvisionApi";
import { create, useStore } from "zustand";
import { immer } from "zustand/middleware/immer";
import { ConfigResponse, SkillConfig } from "@/runtime/types";

interface SmartVisionConfigState {
  config?: ConfigResponse;
  configLoading?: boolean;
  appConfig?: unknown;
  appConfigLoading?: boolean;
  /** 选中的技能配置 */
  selectedSkills?: {
    enabled: boolean;
    toolsets: SkillConfig[];
    mcp_servers: SkillConfig[];
    workFlows: SkillConfig[];
  };
  /** 技能菜单是否可见 */
  skillsVisible?: boolean;
  /** 打开技能菜单的函数 */
  openSkillsFn?: () => void;
  /** 设置打开技能菜单的函数 */
  setOpenSkillsFn?: (fn: () => void) => void;
}
const store = create(immer<SmartVisionConfigState>(() => ({})));

export const getAppConfig = () => {
  return store.getState().config;
};
export const useSmartVisionConfigStore = <U>(
  selector: (state: SmartVisionConfigState) => U,
) => useStore(store, selector);
export const useSmartVisionConfigActions = () => {
  const getConfig = async (force = false) => {
    if (store.getState().configLoading) return; // 正在加载
    if (!force && store.getState().config) return; //已加载
    store.setState((draft) => {
      draft.configLoading = true;
    });
    const config = await loadConfig();
    store.setState((draft) => {
      draft.config = config;
      draft.configLoading = false;
    });
  };
  const loadAppConfig = async (force = false) => {
    if (store.getState().appConfigLoading) return; // 正在加载

    if (!force && store.getState().appConfig) return; //已加载
    store.setState((draft) => {
      draft.appConfigLoading = true;
    });
    const config = await getApp();
    store.setState((draft) => {
      draft.appConfig = config;
      draft.appConfigLoading = false;
    });
  };
  const reloadAppConfig = async () => {
    loadAppConfig(true);
  };
  const reloadConfig = async () => {
    getConfig(true);
  };
  const load = () => {
    getConfig();
    loadAppConfig();
  };

  /**
   * 获取选中的技能列表，过滤掉空数组
   * @returns 过滤后的配置，如果所有数组都为空则返回 null
   */
  const getSelectedSkills = () => {
    const selectedSkills = store.getState().selectedSkills;
    if (!selectedSkills) return null;

    const filtered: Partial<typeof selectedSkills> = {
      enabled: selectedSkills.enabled,
    };

    if (selectedSkills.toolsets.length > 0) {
      filtered.toolsets = selectedSkills.toolsets;
    }
    if (selectedSkills.mcp_servers.length > 0) {
      filtered.mcp_servers = selectedSkills.mcp_servers;
    }
    if (selectedSkills.workFlows.length > 0) {
      filtered.workFlows = selectedSkills.workFlows;
    }

    // 如果所有数组都为空，返回 null
    if (!filtered.toolsets && !filtered.mcp_servers && !filtered.workFlows) {
      return null;
    }

    return filtered;
  };

  /**
   * 同步选中的技能列表（直接设置整个状态）
   * @param toolsets - 工具集 ID 数组
   * @param mcpServers - MCP 服务器 ID 数组
   * @param workFlows - 工作流 ID 数组
   */
  const setSelectedSkills = (
    toolsets: SkillConfig[],
    mcpServers: SkillConfig[],
    workFlows: SkillConfig[],
  ) => {
    store.setState((draft) => {
      draft.selectedSkills = {
        enabled: true,
        toolsets,
        mcp_servers: mcpServers,
        workFlows,
      };
    });
  };

  /**
   * 设置打开技能的函数
   */
  const setOpenSkillsFn = (fn: () => void) => {
    store.setState((draft) => {
      draft.openSkillsFn = fn;
    });
  };

  /**
   * 技能浮窗显示/隐藏状态变化时的回调
   */
  const onSkillVisibleChange = (visible: boolean) => {
    store.setState((draft) => {
      draft.skillsVisible = visible;
    });
  };

  return {
    load,
    reloadAppConfig,
    reloadConfig,
    getSelectedSkills,
    setSelectedSkills,
    setOpenSkillsFn,
    onSkillVisibleChange,
  };
};
