import {
  ConversationItem,
  FileUploadResponse,
  MessageProps,
  SmartVisionChunk,
  SmartVisionMessage,
} from "./types";
import { appid, token, slug, baseURL } from "./config";
import axios from "axios";

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
    this.slug = slug;
  }

  // 构造 API URL
  private get apiUrl(): string {
    return `${this.baseURL}/${this.slug}1/api/apps`;
  }

  // 构造请求头
  private getHeaders(isFile = false): Record<string, string> {
    return {
      Authorization: `Bearer ${this.token}`,
      ...(isFile ? {} : { "Content-Type": "application/json" }),
    };
  }

  // 发送消息并返回流式响应
  async *sendMessage(params: {
    messages: SmartVisionMessage[];
    conversationId?: string;
    taskId?: string;
  }): AsyncGenerator<SmartVisionChunk> {
    const url = `${this.apiUrl}/chat`;
    const headers = this.getHeaders();

    // 将 SmartVisionMessage 转换为 API 所需的格式
    const allMessageContents = params.messages
      .filter((d) => d.type === "human")
      .map((d) => d.content);
    const query =
      allMessageContents
        .map((d) => {
          if (typeof d === "string") {
            return [d];
          }
          return d.filter((d) => d.type === "text").map((d) => d.text);
        })
        .flat()
        .filter(Boolean)
        .at(-1) || "";
    const files = params.messages
      .filter((d) => d.type === "human")
      .map((d) => {
        return d.attachments?.map((d) => d.id) || [];
      })
      .flat()
      .filter(Boolean);
    // 构造请求体（参考 smartversion 的格式）
    const body = {
      // app_id: "-2",
      files: files,
      query: query,
      referenced_query: "",
      response_mode: "streaming",
      stream: true,
      task_id: params.taskId,
      conversation_id: params.conversationId,
      chat_sys_variable: {},
      chat_template_kwargs: {
        crawler_search: false,
        enable_thinking: false,
      },
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

    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6).trim();
              if (data && data !== "[DONE]") {
                try {
                  const parsed = JSON.parse(data) as SmartVisionChunk;
                  yield parsed;
                } catch (e) {
                  console.warn("Failed to parse chunk:", data);
                }
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      console.error("SmartVision API error:", error);
      throw error;
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
}

// 创建单例实例
export const smartVisionClient = new SmartVisionClient();

// 便捷的发送消息函数
export const sendSmartVisionMessage = (params: {
  messages: SmartVisionMessage[];
  conversationId?: string;
  taskId?: string;
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
