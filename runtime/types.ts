"use client";

// SmartVision API 消息类型定义

export type SmartVisionEventType =
  | "agent_message" // 智能体消息
  | "agent_thought" // 智能体消息类型工具消息
  | "message_end" // 模型结束消息
  | "message" // 对话型消息
  | "message_file" // 智能体文件消息
  | "message_replace" // 智能体替换消息（暂无此消息）
  | "error"; // 错误消息

export interface SmartVisionChunk {
  event: SmartVisionEventType;
  id?: string | null;
  task_id?: string | null;
  message_id?: string;
  answer?: string | null;
  created_at?: number;
  reply_id?: string | null;
  first_chunk_time?: number | null;
  conversation_id?: string | null;
  position?: number | null;
  thought?: string | null;
  observation?: string | null;
  tool?: string | null;
  tool_labels?: Record<string, Record<string, unknown>> | null;
  tool_input?: Record<string, unknown> | string | null; // 修改为支持对象格式
  message_files?: string[] | null;
  type?: string | null;
  belongs_to?: string | null;
  url?: string | null;
  status?: string | null; // 修改为 string 以支持 "finished" 等状态
  message?: string | null;
}

// 基础消息内容类型
export type SmartVisionContentPart =
  | { type: "text"; text: string }
  | { type: "text_delta"; text: string }
  | { type: "image_url"; image_url: string | { url: string } }
  | {
      type: "tool-call";
      toolCallId: string;
      toolName: string;
      args: unknown;
      argsText: string;
    }
  | {
      type: "tool-result";
      toolCallId: string;
      result: unknown;
      isError?: boolean;
    };

// 工具调用相关类型
export interface SmartVisionToolCall {
  id: string;
  toolName: string;
  toolInput: Record<string, unknown>;
  toolLabels?: Record<string, Record<string, unknown>>;
  status?: "running" | "finished" | "error";
  observation?: string;
  position?: number;
  messageId?: string;
}

// 工具执行状态
export type SmartVisionToolStatus = "running" | "finished" | "error";

export interface ConversationItem {
  id: string;
  name: string;
  inputs: Record<string, unknown>;
  status: string;
  introduction: string;
  created_at: number;
  updated_at: number;
}
// SmartVision 消息类型（类似 LangChain 的消息结构）
export type SmartVisionMessage =
  | {
      type: "system";
      id: string;
      content: string;
    }
  | {
      type: "human";
      id: string;
      content: string | SmartVisionContentPart[];
    }
  | {
      type: "ai";
      id: string;
      content: string | SmartVisionContentPart[];
      toolCalls?: SmartVisionToolCall[]; // AI 消息可以包含工具调用
    }
  | {
      type: "tool";
      id: string;
      name: string;
      tool_call_id: string;
      content: string;
      artifact?: unknown;
      status?: "success" | "error" | "running";
      toolInput?: Record<string, unknown>;
      toolLabels?: Record<string, Record<string, unknown>>;
      observation?: string;
    };

/** 审查匹配项 */
export interface ReviewStepContent {
  /** 审核步骤名称 */
  step: string;
  /** 审核步骤状态 */
  status: string;
  /** 当前审核进度 */
  current?: number;
  /** 总审核进度 */
  total?: number;
}
export interface MultimodalContent {
  type?:
    | "text"
    | "image_url"
    | "tool"
    | "video_url"
    | "canvas"
    | "reviewStep"
    | "edit_answer";
  text?: string;
  id?: string;
  image_url?: {
    url: string;
  };
  video_url?: {
    url: string;
  };
  tool?: {
    tool_labels?: Record<string, any>;
    tool?: string;
    tool_input?: string;
    tool_execute_time?: number;
    observation?: string;
    data?: any;
    status?: "finished" | "using";
    // 审核步骤数据，在tool中进行展示
    reviewStep?: ReviewStepContent[];
  };
  canvas?: {
    title?: string;
    artifact_id?: string;
    content?: string;
    version_number?: number;
  };
  /** 审核步骤数据 */
  reviewStep?: ReviewStepContent;
  /** 编辑回答数据 */
  editResult?: {
    title?: string;
    artifactId?: string;
    versionNumber?: number;
  };
  /** 时间戳 */
  timestamp?: string;
}
export interface ExecSteps {
  index: string;
  step_item_title: string;
  step_item_type: string;
  step_item_content: string;
  step_item_metadata: string | null;
}
type baseAgentProps = {
  avatar: string;
  id: number;
  name: string;
};
export enum UpvoteStatus {
  None = "0",
  Like = "1",
  Unlike = "2",
}
export interface MessageProps {
  id: string;
  conversation_id: string;
  inputs: { test1: string; sex: string };
  query: string;
  answer: string;
  feedback: null;
  created_at: number;
  regenerate_list: {
    id: string;
    answer: string;
    toolsets_reference?: string;
  }[];
  agent_thoughts: (MultimodalContent["tool"] & {
    files?: string[];
    thought?: string;
    bi_steps?: any;
    canvas_meta?: {
      title: string;
      artifact_id: string;
      version_number: number;
    };
    exec_steps: ExecSteps[];
    observation?: string;
    created_at: number;
  })[];
  message_files: {
    id: string;
    belongs_to: "user" | "assistant";
    url: string;
    type: "image" | "doc" | "video";
    name: string;
  }[];
  referenced_inputs: {
    referenced_query: string;
    referenced_tools: baseAgentProps[];
    referenced_workflows: baseAgentProps[];
    referenced_mcps: baseAgentProps[];
  };
  first_chunk_time: number;
  is_upvote: UpvoteStatus;
  variable?: Record<string, string>;
  is_audio?: boolean;
  canvas_meta?: any;
  cotent?: string;
}
