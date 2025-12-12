import {
  ConversationItem,
  MessageProps,
  SmartVisionChunk,
  SmartVisionMessage,
} from "./types";
import { appid, token, slug, baseURL } from "./config";

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

  // 构造完整的 API URL
  private getApiUrl(): string {
    return `${this.baseURL}/api/apps/chat`;
  }

  // 构造请求头
  private getHeaders(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
    };
  }

  // 发送消息并返回流式响应
  async *sendMessage(params: {
    messages: SmartVisionMessage[];
    conversationId?: string;
    taskId?: string;
  }): AsyncGenerator<SmartVisionChunk> {
    const url = this.getApiUrl();
    const headers = this.getHeaders();

    // 将 SmartVisionMessage 转换为 API 所需的格式
    const apiMessages = params.messages.map((msg) => ({
      role:
        msg.type === "human"
          ? "user"
          : msg.type === "ai"
            ? "assistant"
            : "system",
      content:
        typeof msg.content === "string"
          ? msg.content
          : String(msg.content || ""),
    }));

    // 构造请求体（参考 smartversion 的格式）
    const body = {
      app_id: this.appid,
      files: undefined,
      inputs: {},
      query: apiMessages[apiMessages.length - 1]?.content || "",
      referenced_query: "",
      response_mode: "streaming",
      stream: true,
      task_id: params.taskId,
      conversation_id: params.conversationId,
      agent_mode: {
        enabled: true,
        toolsets: undefined,
        workFlows: undefined,
      },
      messages: apiMessages,
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
      `${this.baseURL}/api/apps/conversations?limit=${params.limit}&start_time=${params.start_time}&end_time=${params.end_time}`,
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
      `${this.baseURL}/api/apps/messages?conversation_id=${conversationId}`,
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
