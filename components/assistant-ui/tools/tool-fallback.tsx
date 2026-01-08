import type { ToolCallMessagePartComponent } from "@assistant-ui/react";
import { useAssistantState } from "@assistant-ui/react";
import { ChevronDown, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useMemo, useState, useEffect, type FC } from "react";
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

// ==================== 类型定义 ====================
type ToolCallData = {
  toolCallId?: string;
  toolName?: string;
  argsText?: string;
  result?: unknown;
  labels?: Record<string, string>;
  tool_execute_time?: number;
};

// ==================== 工具函数 ====================
/** 判断工具是否有执行结果（通过 observation/result 字段） */
const hasObservation = (result?: unknown): boolean => {
  return result !== undefined && result !== null && result !== "";
};

/** 判断工具执行是否出错 */
const isErrorResult = (result?: unknown): boolean => {
  return (
    result !== null &&
    result !== undefined &&
    typeof result === "object" &&
    "error" in result
  );
};

/** 格式化工具执行结果 */
const formatToolResult = (result?: unknown): string => {
  if (!hasObservation(result)) return "";
  if (typeof result === "string") return result;
  return JSON.stringify(result, null, 2);
};

/** 格式化耗时显示（秒 -> 保留两位小数） */
const formatDuration = (duration?: number): string => {
  if (duration == null) return "";
  return `${Math.round(duration * 100) / 100}s`;
};

/** 获取工具显示名称（优先使用中文标签） */
const getToolDisplayName = (toolData: ToolCallData): string => {
  return toolData.labels?.["zh_Hans"] || toolData.toolName || "";
};

// ==================== 箭头图标组件 ====================
const ArrowIcon = () => (
  <ExecutionResultArrowPrimitive>
    <ChevronDown className="size-4" />
  </ExecutionResultArrowPrimitive>
);

// ==================== 单个工具调用项组件 ====================
const ToolCallItem: FC<{
  toolData: ToolCallData;
  handleCopy: (text: string) => void;
}> = ({ toolData, handleCopy }) => {
  const isLoading = !hasObservation(toolData.result);
  const isError = isErrorResult(toolData.result);
  const displayName = getToolDisplayName(toolData);

  // 正在执行中的步骤自动展开，已完成的步骤自动收起
  const [itemOpen, setItemOpen] = useState(isLoading);
  useEffect(() => {
    setItemOpen(isLoading);
  }, [isLoading]);

  return (
    <ExecutionResultItemPrimitive open={itemOpen} onOpenChange={setItemOpen}>
      <ExecutionResultItemHeaderPrimitive arrow={<ArrowIcon />}>
        <ExecutionResultItemIconPrimitive>
          {isLoading ? (
            <Loader2 className="size-4 text-[var(--text-brand)] animate-spin" />
          ) : isError ? (
            <XCircle className="size-4 text-[var(--text-error)]" />
          ) : (
            <CheckCircle2 className="size-4 text-[var(--text-success)]" />
          )}
        </ExecutionResultItemIconPrimitive>
        <ExecutionResultItemTitlePrimitive>
          {isLoading ? (
            <span className="animate-pulse">调用中</span>
          ) : isError ? (
            "调用失败"
          ) : (
            "调用成功"
          )}
        </ExecutionResultItemTitlePrimitive>
        <ExecutionResultItemToolNamePrimitive>
          {displayName}
        </ExecutionResultItemToolNamePrimitive>
        {toolData.tool_execute_time !== undefined && !isLoading && (
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
            title={isError ? "错误信息" : "响应结果"}
            onCopy={() => handleCopy(formatToolResult(toolData.result))}
          >
            {formatToolResult(toolData.result)}
          </ExecutionResultSectionPrimitive>
        )}
      </ExecutionResultItemContentPrimitive>
    </ExecutionResultItemPrimitive>
  );
};

/**
 * 默认工具调用组件
 * 支持多个工具调用统一包裹在一个 ExecutionResultContainer 中
 *
 * 实现方案：
 * 1. 使用 useAssistantState 获取当前消息的所有工具调用
 * 2. 第一个工具调用渲染完整的容器结构（Container + Title + Content + 所有Item）
 * 3. 其他工具调用返回 null，避免重复渲染
 */
export const ToolFallback: ToolCallMessagePartComponent = ({
  toolName,
  argsText,
  result,
  toolCallId,
  //@ts-expect-error labels 可能不存在
  labels,
}) => {
  const messageParts = useAssistantState((state) => state.message?.parts);

  // 过滤并缓存工具调用数组
  const toolCalls = useMemo(() => {
    if (!messageParts) return [];
    return messageParts.filter(
      (part: { type?: string }) => part.type === "tool-call"
    ) as ToolCallData[];
  }, [messageParts]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {
      // 静默处理复制失败
    });
  };

  // 找到当前工具调用在列表中的索引
  const currentIndex = toolCalls.findIndex(
    (tool) => tool?.toolCallId === toolCallId
  );
  const isFirst = currentIndex === 0;
  const totalCount = toolCalls.length;

  // 计算总耗时（只计算已完成的工具）
  const totalDuration = useMemo(() => {
    return toolCalls.reduce((total, tool) => {
      if (
        tool &&
        hasObservation(tool.result) &&
        typeof tool.tool_execute_time === "number"
      ) {
        return total + tool.tool_execute_time;
      }
      return total;
    }, 0);
  }, [toolCalls]);

  // 检查是否有正在执行的工具
  const hasLoadingTools = useMemo(() => {
    return toolCalls.some(
      (tool) => tool && !hasObservation(tool.result)
    );
  }, [toolCalls]);

  // 容器展开状态：有正在执行的工具时自动展开，全部完成后自动收起
  const [containerOpen, setContainerOpen] = useState(hasLoadingTools);
  useEffect(() => {
    setContainerOpen(hasLoadingTools);
  }, [hasLoadingTools]);

  // 边界情况：找不到匹配的工具调用或没有其他工具调用，使用当前组件的 props 作为 fallback
  if (currentIndex === -1 || totalCount === 0) {
    const currentTool = toolCalls.find((t) => t?.toolCallId === toolCallId);
    const currentToolData: ToolCallData = {
      toolCallId,
      toolName,
      argsText,
      result,
      labels,
      tool_execute_time: currentTool?.tool_execute_time,
    };
    const isLoading = !hasObservation(result);
    const displayName = getToolDisplayName(currentToolData);

    return (
      <div className="aui-tool-fallback-root mb-4 w-full">
        <ExecutionResultContainerPrimitive defaultOpen={isLoading}>
          <ExecutionResultTitlePrimitive arrow={<ArrowIcon />}>
            已执行工具: {displayName}
            {currentToolData.tool_execute_time !== undefined &&
              !isLoading && (
                <span className="ml-2">
                  ({formatDuration(currentToolData.tool_execute_time)})
                </span>
              )}
          </ExecutionResultTitlePrimitive>
          <ExecutionResultContentPrimitive>
            <ToolCallItem toolData={currentToolData} handleCopy={handleCopy} />
          </ExecutionResultContentPrimitive>
        </ExecutionResultContainerPrimitive>
      </div>
    );
  }

  // 第一个工具调用：渲染完整的容器结构和所有工具调用项
  if (isFirst) {
    return (
      <div className="aui-tool-fallback-root mb-4 w-full">
        <ExecutionResultContainerPrimitive
          open={containerOpen}
          onOpenChange={setContainerOpen}
        >
          <ExecutionResultTitlePrimitive arrow={<ArrowIcon />}>
            {hasLoadingTools ? (
              <span className="animate-pulse">正在执行中</span>
            ) : (
              <>
                已执行完成，调用{totalCount}个工具
                {totalDuration > 0 && (
                  <span className="ml-2">
                    （用时 {formatDuration(totalDuration)}）
                  </span>
                )}
              </>
            )}
          </ExecutionResultTitlePrimitive>
          <ExecutionResultContentPrimitive>
            {toolCalls.map((tool, index) => (
              <ToolCallItem
                key={tool.toolCallId || index}
                toolData={tool}
                handleCopy={handleCopy}
              />
            ))}
          </ExecutionResultContentPrimitive>
        </ExecutionResultContainerPrimitive>
      </div>
    );
  }

  // 其他工具调用：返回 null，因为第一个工具调用已经渲染了所有内容
  return null;
};
