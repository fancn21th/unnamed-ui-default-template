import type { SmartVisionMessage } from "./types";

export const generateUniqueId = (prefix: string) =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// 🎯 更安全的消息查找
export const findMessageById = (messages: SmartVisionMessage[], id: string) => {
  return messages.findIndex((msg) => msg.id === id);
};
