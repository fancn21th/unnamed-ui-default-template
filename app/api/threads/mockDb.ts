// Mock in-memory database for threads
export type MockThread = {
  id: string;
  external_id?: string;
  title?: string;
  is_archived: boolean;
  createdAt: string;
};

export const mockThreadsDb: Record<string, MockThread> = {
  // Initialize with some sample threads for development
  thread_1: {
    id: "thread_1",
    external_id: "local_1",
    title: "Welcome to Assistant UI",
    is_archived: false,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  thread_2: {
    id: "thread_2",
    external_id: "local_2",
    title: "How to build with Next.js",
    is_archived: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  thread_3: {
    id: "thread_3",
    external_id: "local_3",
    title: "API Integration Guide",
    is_archived: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
};

let threadIdCounter = 3;

export function generateThreadId(): string {
  return `thread_${++threadIdCounter}`;
}
