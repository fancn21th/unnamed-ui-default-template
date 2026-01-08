import {
  ConversationItem,
  FileUploadResponse,
  MessageProps,
  SmartVisionChunk,
  Toolset,
  UpvoteStatus,
} from "./types";
import { appid, token, slug, baseURL } from "./config";
import axios from "axios";
import { ThreadUserMessage } from "@assistant-ui/react";
import { getAppConfig } from "@/runtime/smartVisionConfigRuntime";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { EventSourceMessage } from "@microsoft/fetch-event-source/lib/cjs/parse";
import { AsyncQueue } from "@/lib/AsyncQueue";

type SendMessageEvent =
  | {
      type: "streaming";
      value: SmartVisionChunk;
    }
  | {
      type: "complete";
    }
  | {
      type: "error";
      value: Error;
    };
// SmartVision API 客户端
export class SmartVisionClient {
  private baseURL: string;
  private appid: string;
  private token: string;
  private slug: string;

  constructor() {
    this.baseURL = baseURL;
    this.appid = appid;
    this.token = token;
    // 优先从 URL 查询参数获取 slug，如果没有则使用环境变量
    this.slug = this.getSlugFromUrl() || slug;
  }

  // 从 URL 查询参数中获取 slug
  private getSlugFromUrl(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('slug');
  }

  // 构造 API URL
  private get apiUrl(): string {
    return `${this.baseURL}/api/apps`;
  }

  // 构造请求头
  private getHeaders(isFile = false): Record<string, string> {
    return {
      Authorization: `Bearer ${this.token}`,
      ...(isFile ? {} : { "Content-Type": "application/json" }),
      "instance-id": this.slug,
    };
  }

  // 发送消息并返回流式响应
  async *sendMessage(params: {
    messages: ThreadUserMessage;
    conversationId?: string;
    taskId?: string;
    agentMode?: any;
  }): AsyncGenerator<SmartVisionChunk> {
    const url = `${this.apiUrl}/chat`;
    const headers = this.getHeaders();

    // 将 SmartVisionMessage 转换为 API 所需的格式
    const allMessageContents = params.messages.content;
    const query = allMessageContents
      .map((d) => {
        if (d.type === "text") {
          return d.text;
        }
        return null;
      })
      .filter(Boolean)
      .join("");
    const files = params.messages.attachments.map((d) => d.id).filter(Boolean);
    const referenced_query = params.messages.metadata.custom
      ?.reference as string;
    const tools = params.messages.metadata.custom?.tools as Toolset[];
    // 构造请求体（参考 smartversion 的格式）
    const body = {
      app_id: getAppConfig()?.application_id,
      files: files,
      query: query,
      referenced_query,
      response_mode: "streaming",
      stream: true,
      task_id: params.taskId,
      conversation_id: params.conversationId,
      chat_sys_variable: {},
      chat_template_kwargs: {},
      // ...(tools.length
      //   ? {
      //       agent_mode: {
      //         enabled: true,
      //         toolsets: tools,
      //       },
      //     }
      //   : {}),
      // model: {
      //   model_id: 3081,
      //   provider: "dcmodel",
      //   name: "GPT-OSS",
      //   model_key: "/data/models/gpt-oss",
      //   api_base: null,
      //   completion_params: {
      //     presence_penalty: 0.1,
      //     max_tokens: 4096,
      //     top_p: 0.9,
      //     frequency_penalty: 0.1,
      //     temperature: 0.5,
      //   },
      //   tenant_id: 1,
      // },
      // messages: apiMessages,
    };

    const requestBody = Object.assign(
      {},
      body,
      params.agentMode ? { agent_mode: params.agentMode } : {},
    );
    const queue = new AsyncQueue<SendMessageEvent>();

    const controller = new AbortController();
    let done = false;

    // 当生成器被提前 return / throw 时，自动关闭连接
    const cleanup = () => {
      if (!done) {
        done = true;
        controller.abort();
      }
    };
    // 监听 SSE 消息
    const onmessage = (event: EventSourceMessage) => {
      if (done) return;

      const { data } = event;
      if (data === "[DONE]") {
        cleanup();
        return;
      }

      try {
        const parsed = JSON.parse(data) as SmartVisionChunk;
        // 放入队列
        queue.push({ value: parsed, type: "streaming" });
      } catch (e) {
        console.warn("Failed to parse SSE message:", data, e);
        // 可选：把错误也推入队列，或直接忽略
        queue.push({ value: e as Error, type: "error" });
      }
    };

    const onerror = (err: any) => {
      if (done) return;
      console.error("SSE connection error:", err);
      // 注意：fetch-event-source 默认会重连，除非你抛出异常
      // 如果你想终止流，可以 cleanup()，但通常让其重连更健壮
    };
    fetchEventSource(url, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
      signal: controller.signal,
      onmessage,
      onerror,
      onopen(response) {
        // 可选：检查响应状态
        if (response.status !== 200) {
          throw new Error(`SSE connection failed: ${response.status}`);
        }
        return Promise.resolve();
      },
    }).catch((err) => {
      if (!controller.signal.aborted) {
        console.error("SSE fetch failed:", err);
      }
    });
    try {
      while (!done) {
        const event = await queue.next();
        if (event.type === "error") {
          // 可选：是否抛出解析错误？这里选择跳过
          continue;
        }
        if (event.type === "complete") {
          break;
        }
        yield event.value;
      }
    } finally {
      cleanup();
    }
  }

  /**
   * 获取会话列表
   * */
  async conversationsList(): Promise<ConversationItem[]> {
    const headers = this.getHeaders();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const params: Record<string, unknown> = {
      limit: 20,
    };

    // 添加日期筛选参数
    if (today) {
      params.start_time = Math.floor(today.getTime() / 1000);
      params.end_time = Math.floor(
        (today.getTime() + 24 * 60 * 60 * 1000) / 1000,
      );
    }

    const response = await fetch(
      `${this.apiUrl}/conversations?limit=${params.limit}&start_time=${params.start_time}&end_time=${params.end_time}`,
      {
        headers,
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error("No response body");
    }
    const result = await response.json();
    return result?.data || [];
  }

  /**
   * 获取会话消息
   * */
  async conversationsMessages(conversationId: string): Promise<MessageProps[]> {
    const headers = this.getHeaders();
    const response = await fetch(
      `${this.apiUrl}/messages?conversation_id=${conversationId}`,
      {
        headers,
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error("No response body");
    }
    const result = await response.json();
    return result?.data || [];
  }

  /**
   * 文件上传
   * */
  async fileUpload(
    file: File,
    /**
     * 上传进度，百分比
     * */
    onProgress?: (progress: number) => void,
  ): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);
    const headers = this.getHeaders(true);
    const response = await axios.post(`${this.apiUrl}/file/upload`, formData, {
      headers,
      onUploadProgress: (event) => {
        const percentCompleted = Math.round((event.progress || 0) * 100);
        onProgress?.(percentCompleted);
      },
    });
    const result = response.data;
    return result?.data;
  }

  /**
   * 对消息进行点赞操作
   * */
  async messageUpvote(data: {
    message_id: string;
    is_upvote: UpvoteStatus;
    content?: string;
  }): Promise<{ is_upvote?: UpvoteStatus }> {
    const headers = this.getHeaders();
    const response = await fetch(`${this.apiUrl}/is-upvote`, {
      headers,
      body: JSON.stringify(data),
      method: "POST",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error("No response body");
    }
    const result = await response.json();
    return result?.data || {};
  }

  /**
   * 获取配置
   * */
  async loadConfig() {
    const headers = this.getHeaders();
    const response = await fetch(`${this.apiUrl}/config`, {
      headers,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error("No response body");
    }
    const result = await response.json();
    return result || {};
  }

  /**
   * 获取应用配置
   * */
  async getApp() {
    const headers = this.getHeaders();
    const response = await fetch(`${this.apiUrl}/getApp`, {
      headers,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error("No response body");
    }
    const result = await response.json();
    return result || {};
  }
}

// 创建单例实例
export const smartVisionClient = new SmartVisionClient();

// 便捷的发送消息函数
export const sendSmartVisionMessage = (params: {
  messages: ThreadUserMessage;
  conversationId?: string;
  taskId?: string;
  agentMode?: any;
}) => {
  return smartVisionClient.sendMessage(params);
};

// 获取会话历史
export const getConversationsList = () => {
  return smartVisionClient.conversationsList();
};

// 获取会话消息
export const getConversationsMessages = (conversationId: string) => {
  return smartVisionClient.conversationsMessages(conversationId);
};

// 上传会话文件
export const uploadChatFile = (
  file: File /**
   * 上传进度，百分比
   * */,
  onProgress?: (progress: number) => void,
) => {
  return smartVisionClient.fileUpload(file, onProgress);
};

// 对消息进行点赞操作
export const upvoteMessage = (data: {
  message_id: string;
  is_upvote: UpvoteStatus;
  content?: string;
}) => {
  return smartVisionClient.messageUpvote(data);
};

// 获取配置
export const loadConfig = () => {
  return smartVisionClient.loadConfig();
};

// 获取App配置
export const getApp = () => {
  return smartVisionClient.getApp();
};
