import type { ToolCallMessagePartComponent } from "@assistant-ui/react";
import { useAssistantState } from "@assistant-ui/react";
import { ChevronDown, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useMemo } from "react";
import {
  ExecutionResultContainerPrimitive,
  ExecutionResultTitlePrimitive,
  ExecutionResultContentPrimitive,
  ExecutionResultItemPrimitive,
  ExecutionResultItemHeaderPrimitive,
  ExecutionResultItemIconPrimitive,
  ExecutionResultItemTitlePrimitive,
  ExecutionResultItemContentPrimitive,
  ExecutionResultSectionPrimitive,
  ExecutionResultArrowPrimitive,
  ExecutionResultItemToolNamePrimitive,
} from "@/components/wuhan/blocks/execution-result-01";

/**
 * 默认工具调用
 * 支持多个工具调用统一包裹在一个 ExecutionResultContainer 中
 * 
 * 实现方案：
 * 1. 使用 useAssistantState 获取当前消息的所有工具调用
 * 2. 第一个工具调用渲染完整的容器结构（Container + Title + Content + 所有Item）
 * 3. 其他工具调用返回 null，避免重复渲染
 * 
 * 这样确保所有工具调用都在同一个 ExecutionResultContainer 中，与示例一致
 */
export const ToolFallback: ToolCallMessagePartComponent = ({
  toolName,
  argsText,
  result,
  toolCallId,
  //@ts-expect-error labels 可能不存在
  labels,
}) => {
  // 获取当前消息的所有 parts（稳定的引用）
  // assistant-ui 使用 message.parts 而不是 message.content
  const messageParts = useAssistantState((state) => state.message?.parts);

  // 使用 useMemo 缓存过滤后的工具调用数组，避免无限循环
  const toolCalls = useMemo(() => {
    if (!messageParts) return [];
    return messageParts.filter(
      (part: { type?: string }) => part.type === "tool-call"
    ) as Array<{
      toolCallId?: string;
      toolName?: string;
      argsText?: string;
      result?: unknown;
      labels?: Record<string, string>;
      tool_execute_time?: number; // 工具执行耗时（秒）
    }>;
  }, [messageParts]);

  // 复制功能
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // 格式化耗时显示（秒 -> 保留两位小数）
  const formatDuration = (duration?: number): string => {
    if (duration === undefined || duration === null) return "";
    const rounded = Math.round(duration * 100) / 100;
    return `${rounded}s`;
  };

  // 渲染单个工具调用项的辅助函数
  const renderToolCallItemByData = (
    toolData: {
      toolCallId?: string;
      toolName?: string;
      argsText?: string;
      result?: unknown;
      labels?: Record<string, string>;
      tool_execute_time?: number; // 工具执行耗时（秒）
    },
    index: number
  ) => {
    // 根据文档：通过 observation（即 result）字段判断状态
    // observation 存在 = 'finished'（完成），不存在 = 'using'（执行中）
    const hasObservation = toolData.result !== undefined && 
                           toolData.result !== null && 
                           toolData.result !== "";
    const toolIsFinished = hasObservation;
    const toolIsLoading = !toolIsFinished;
    
    // 判断是否是错误
    const toolIsError =
      toolData.result &&
      typeof toolData.result === "object" &&
      "error" in toolData.result;
    
    const toolDisplayName =
      toolData.labels?.["zh_Hans"] || toolData.toolName || "";

    const formatToolResult = () => {
      if (toolData.result === undefined || toolData.result === null || toolData.result === "") return "";
      if (typeof toolData.result === "string") return toolData.result;
      return JSON.stringify(toolData.result, null, 2);
    };

    return (
      <ExecutionResultItemPrimitive key={toolData.toolCallId || index} defaultOpen={index === 0}>
        <ExecutionResultItemHeaderPrimitive
          arrow={
            <ExecutionResultArrowPrimitive>
              <ChevronDown className="size-4" />
            </ExecutionResultArrowPrimitive>
          }
        >
          <ExecutionResultItemIconPrimitive>
            {toolIsLoading ? (
              <Loader2 className="size-4 text-[var(--text-brand)] animate-spin" />
            ) : toolIsError ? (
              <XCircle className="size-4 text-[var(--text-error)]" />
            ) : (
              <CheckCircle2 className="size-4 text-[var(--text-success)]" />
            )}
          </ExecutionResultItemIconPrimitive>
          <ExecutionResultItemTitlePrimitive>
            {toolIsLoading
              ? `调用中`
              : toolIsError
                ? `调用失败`
                : `调用成功`}
          </ExecutionResultItemTitlePrimitive>
          <ExecutionResultItemToolNamePrimitive>
              {toolDisplayName}
          </ExecutionResultItemToolNamePrimitive>
            {toolData.tool_execute_time !== undefined && toolIsFinished && (
              <span className="ml-2 text-sm text-[var(--text-primary)]">
                {formatDuration(toolData.tool_execute_time)}
              </span>
            )}
        </ExecutionResultItemHeaderPrimitive>
        <ExecutionResultItemContentPrimitive>
          {toolData.argsText && (
            <ExecutionResultSectionPrimitive
              title="请求参数"
              onCopy={() => handleCopy(toolData.argsText || "")}
            >
              {toolData.argsText}
            </ExecutionResultSectionPrimitive>
          )}
          {toolData.result !== undefined && (
            <ExecutionResultSectionPrimitive
              title={toolIsError ? "错误信息" : "响应结果"}
              onCopy={() => handleCopy(formatToolResult())}
            >
              {formatToolResult()}
            </ExecutionResultSectionPrimitive>
          )}
        </ExecutionResultItemContentPrimitive>
      </ExecutionResultItemPrimitive>
    );
  };

  // 找到当前工具调用在列表中的索引
  const currentIndex = toolCalls.findIndex(
    (tool) => tool.toolCallId === toolCallId
  );
  const isFirst = currentIndex === 0;
  const totalCount = toolCalls.length;

  // 计算总耗时（只计算已完成的工具）
  const totalDuration = useMemo(() => {
    let total = 0;
    toolCalls.forEach((tool) => {
      // 只计算已完成的工具（有 observation/result）
      const hasObservation = tool.result !== undefined && 
                             tool.result !== null && 
                             tool.result !== "";
      if (hasObservation && typeof tool.tool_execute_time === "number") {
        total += tool.tool_execute_time;
      }
    });
    return Math.round(total * 100) / 100; // 保留两位小数
  }, [toolCalls]);

  // 如果找不到匹配的工具调用或没有其他工具调用，使用当前组件的 props 作为 fallback
  if (currentIndex === -1 || totalCount === 0) {
    // 没有其他工具调用或找不到匹配，直接渲染当前这一个
    return (
      <div className="aui-tool-fallback-root mb-4 w-full">
        <ExecutionResultContainerPrimitive defaultOpen>
          <ExecutionResultTitlePrimitive
            arrow={
              <ExecutionResultArrowPrimitive>
                <ChevronDown className="size-4" />
              </ExecutionResultArrowPrimitive>
            }
          >
            已执行工具: {labels?.["zh_Hans"] || toolName || ""}
            {(() => {
              const currentTool = toolCalls.find(t => t.toolCallId === toolCallId);
              return currentTool?.tool_execute_time !== undefined && 
                     result !== undefined && result !== null && result !== "" && (
                <span className="ml-2">
                  ({formatDuration(currentTool.tool_execute_time)})
                </span>
              );
            })()}
          </ExecutionResultTitlePrimitive>
          <ExecutionResultContentPrimitive>
            {renderToolCallItemByData(
              {
                toolCallId,
                toolName,
                argsText,
                result,
                labels,
                // tool_execute_time 可能不存在于 props 中，从 toolCalls 中查找
                tool_execute_time: toolCalls.find(t => t.toolCallId === toolCallId)?.tool_execute_time,
              },
              0
            )}
          </ExecutionResultContentPrimitive>
        </ExecutionResultContainerPrimitive>
      </div>
    );
  }

  // 如果是第一个工具调用，渲染完整的容器结构和所有工具调用项
  if (isFirst) {
    return (
      <div className="aui-tool-fallback-root mb-4 w-full">
        <ExecutionResultContainerPrimitive defaultOpen>
          <ExecutionResultTitlePrimitive
            arrow={
              <ExecutionResultArrowPrimitive>
                <ChevronDown className="size-4" />
              </ExecutionResultArrowPrimitive>
            }
          >
            已执行完成，调用{totalCount}个工具
            {totalDuration > 0 && (
              <span className="ml-2">
                （用时 {formatDuration(totalDuration)}）
              </span>
            )}
          </ExecutionResultTitlePrimitive>
          <ExecutionResultContentPrimitive>
            {toolCalls.map((tool, index) =>
              renderToolCallItemByData(tool, index)
            )}
          </ExecutionResultContentPrimitive>
        </ExecutionResultContainerPrimitive>
      </div>
    );
  }

  // 其他工具调用：返回 null，因为第一个工具调用已经渲染了所有内容
  return null;
};
