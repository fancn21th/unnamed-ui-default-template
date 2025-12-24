import { unstable_useRemoteThreadListRuntime as useRemoteThreadListRuntime } from "@assistant-ui/react";
import { useSmartVisionThreadListAdapter } from "./useSmartVisionThreadListAdapter";
import { useSmartVisionChatThreadRuntime } from "@/runtime/useSmartVisionChatThreadRuntime";

// 创建符合 assistant-ui 标准的运行时
export const useSmartVisionChatRuntime = () => {
  /**
   * 实现自定义会话历史记录，关键是要实现这个Adapter
   * */
  const threadListAdapter = useSmartVisionThreadListAdapter();

  /**
   * ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️ 注意
   * 这里必须返回一个新的ChatThreadRuntime实例
   * 否则会导致线程列表和聊天线程之间的状态混乱
   * 解释：assistant-ui 每一个聊天会话对应一个聊天的runtime
   * ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
   * */

  // https://www.assistant-ui.com/docs/runtimes/custom/custom-thread-list#how-it-works
  // When the hook mounts it calls list() on your adapter, hydrates existing threads, and uses your runtime hook to spawn a runtime whenever a thread is opened. Creating a new conversation calls initialize(threadId) so you can create a record server-side and return the canonical remoteId.
  const useRuntimeHook = () => useSmartVisionChatThreadRuntime();

  return useRemoteThreadListRuntime({
    runtimeHook: useRuntimeHook,
    adapter: threadListAdapter,
  });
};
