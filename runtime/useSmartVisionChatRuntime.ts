import { unstable_useRemoteThreadListRuntime as useRemoteThreadListRuntime } from "@assistant-ui/react";
import { useSmartVisionThreadListAdapter } from "./useSmartVisionThreadListAdapter";
import { useSmartVisionChatThreadRuntime } from "@/runtime/useSmartVisionChatThreadRuntime";

// 创建符合 assistant-ui 标准的运行时
export const useSmartVisionChatRuntime = () => {
  /**
   * 实现自定义会话历史记录，关键是要实现这个Adapter
   * */
  const threadListAdapter = useSmartVisionThreadListAdapter();

  return useRemoteThreadListRuntime({
    /**
     * ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️ 注意
     * 这里必须返回一个新的ChatThreadRuntime实例
     * 否则会导致线程列表和聊天线程之间的状态混乱
     * 解释：assistant-ui 每一个聊天会话对应一个聊天的runtime
     * ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
     * */
    runtimeHook: () => useSmartVisionChatThreadRuntime(),
    adapter: threadListAdapter,
  });
};
