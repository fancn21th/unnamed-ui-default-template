import { loadConfig, getApp } from "@/runtime/smartvisionApi";
import { create, useStore } from "zustand";
import { immer } from "zustand/middleware/immer";
import { ConfigResponse } from "@/runtime/types";
import { AgentConfig } from "@/components/assistant-ui/thread/SenderInput";
interface SmartVisionConfigState {
  config?: ConfigResponse;
  configLoading?: boolean;
  appConfig?: AgentConfig[];
  appConfigLoading?: boolean;
  selectedAgents?: {
    enabled: boolean;
    toolsets: AgentConfig[];
    mcp_servers: AgentConfig[];
    workFlows: AgentConfig[];
  };
}
const store = create(immer<SmartVisionConfigState>(() => ({})));

export const getAppConfig = () => { return store.getState().config;}
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
   * 获取选中的代理配置，过滤掉空数组
   * @returns 过滤后的配置，如果所有数组都为空则返回 null
   */
  const getSelectedAgents = () => {
    const selectedAgents = store.getState().selectedAgents;
    if (!selectedAgents) return null;

    const filtered: Partial<typeof selectedAgents> = {
      enabled: selectedAgents.enabled,
    };

    if (selectedAgents.toolsets.length > 0) {
      filtered.toolsets = selectedAgents.toolsets;
    }
    if (selectedAgents.mcp_servers.length > 0) {
      filtered.mcp_servers = selectedAgents.mcp_servers;
    }
    if (selectedAgents.workFlows.length > 0) {
      filtered.workFlows = selectedAgents.workFlows;
    }

    // 如果所有数组都为空，返回 null
    if (!filtered.toolsets && !filtered.mcp_servers && !filtered.workFlows) {
      return null;
    }

    return filtered;
  };

  /**
   * 同步选中的代理配置（直接设置整个状态）
   * @param toolsets - 工具集 ID 数组
   * @param mcpServers - MCP 服务器 ID 数组
   * @param workFlows - 工作流 ID 数组
   */
  const syncSelectedAgents = (
    toolsets: AgentConfig[],
    mcpServers: AgentConfig[],
    workFlows: AgentConfig[],
  ) => {
    store.setState((draft) => {
      draft.selectedAgents = {
        enabled: true,
        toolsets,
        mcp_servers: mcpServers,
        workFlows,
      };
    });
  };

  return {
    load,
    reloadAppConfig,
    reloadConfig,
    getSelectedAgents,
    syncSelectedAgents,
  };
};
