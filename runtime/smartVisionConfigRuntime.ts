import { loadConfig, getApp } from "@/runtime/smartvisionApi";
import { create, useStore } from "zustand";
import { immer } from "zustand/middleware/immer";
import { ConfigResponse } from "@/runtime/types";

interface SmartVisionConfigState {
  config?: ConfigResponse;
  configLoading?: boolean;
  appConfig?: any;
  appConfigLoading?: boolean;
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
  return { load, reloadAppConfig, reloadConfig };
};
