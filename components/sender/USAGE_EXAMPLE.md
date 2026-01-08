# Sender 组件使用示例

## 通过按钮触发 suggestion 浮窗

### 基础用法

```tsx
import { useRef } from 'react';
import { Sender, type SenderRef } from '@/components/sender';

function MyComponent() {
  const senderRef = useRef<SenderRef>(null);

  const handleOpenMenu = () => {
    // 触发斜杠菜单
    senderRef.current?.openSuggestion('/');
  };

  const handleOpenMention = () => {
    // 触发 @ 提及菜单
    senderRef.current?.openSuggestion('@');
  };

  return (
    <div>
      <div className="toolbar">
        <button onClick={handleOpenMenu}>
          打开命令菜单 (/)
        </button>
        <button onClick={handleOpenMention}>
          提及用户 (@)
        </button>
      </div>
      
      <Sender
        ref={senderRef}
        suggestionDataProvider={yourDataProvider}
        // ... 其他 props
      />
    </div>
  );
}
```

### 完整示例

```tsx
'use client';

import { useRef, useState } from 'react';
import { Sender, type SenderRef, type SuggestionItem } from '@/components/sender';

export default function ChatInput() {
  const senderRef = useRef<SenderRef>(null);
  const [message, setMessage] = useState('');

  const suggestionData: SuggestionItem[] = [
    { value: 1, label: '工具集 A', type: 'toolset' },
    { value: 2, label: '工作流 B', type: 'workflow' },
    { value: 3, label: 'MCP服务器 C', type: 'mcp' },
  ];

  const handleSubmit = (text: string) => {
    console.log('提交消息:', text);
    return true; // 返回 true 清空编辑器
  };

  return (
    <div className="chat-container">
      {/* 工具栏 */}
      <div className="toolbar flex gap-2 mb-2">
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded"
          onClick={() => senderRef.current?.openSuggestion('/')}
        >
          📝 命令
        </button>
        <button
          className="px-3 py-1 bg-green-500 text-white rounded"
          onClick={() => senderRef.current?.openSuggestion('@')}
        >
          👤 提及
        </button>
        <button
          className="px-3 py-1 bg-gray-500 text-white rounded"
          onClick={() => senderRef.current?.focus()}
        >
          🎯 聚焦
        </button>
      </div>

      {/* 编辑器 */}
      <Sender
        ref={senderRef}
        value={message}
        onChange={setMessage}
        onSubmit={handleSubmit}
        suggestionDataProvider={suggestionData}
        placeholder="输入消息... (/ 命令, @ 提及)"
        referenceSelector=".chat-container" // 浮窗相对于容器定位
      />
    </div>
  );
}
```

## SenderRef API

### `openSuggestion(trigger?: string)`
手动触发建议浮窗。

- **参数**:
  - `trigger` (可选): 触发字符，`'/'` 或 `'@'`，默认为 `'/'`
- **返回**: `void`

```tsx
// 打开斜杠命令菜单
senderRef.current?.openSuggestion('/');

// 打开 @ 提及菜单
senderRef.current?.openSuggestion('@');

// 使用默认触发字符 (/)
senderRef.current?.openSuggestion();
```

### `focus()`
聚焦到编辑器。

```tsx
senderRef.current?.focus();
```

### `getEditor()`
获取底层的 Tiptap 编辑器实例，用于高级操作。

```tsx
const editor = senderRef.current?.getEditor();
if (editor) {
  // 获取 HTML 内容
  const html = editor.getHTML();
  
  // 清空内容
  editor.commands.clearContent();
  
  // 其他 Tiptap 命令...
}
```

## 实际应用场景

### 1. 工具栏按钮
在聊天应用中提供快捷按钮，让用户快速选择工具或提及用户。

### 2. 快捷键
结合键盘事件，实现快捷键触发。

```tsx
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Ctrl+K 打开命令菜单
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault();
      senderRef.current?.openSuggestion('/');
    }
    // Ctrl+@ 打开提及菜单
    if (e.ctrlKey && e.key === '@') {
      e.preventDefault();
      senderRef.current?.openSuggestion('@');
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
```

### 3. 语音输入后自动打开菜单
在语音识别后，自动打开相关菜单让用户选择。

```tsx
const handleVoiceComplete = (text: string) => {
  // 设置识别的文本
  setMessage(text);
  
  // 自动打开命令菜单让用户补充
  setTimeout(() => {
    senderRef.current?.openSuggestion('/');
  }, 100);
};
```

## 注意事项

1. **ref 类型**: 确保使用 `SenderRef` 类型标注 ref
2. **空值检查**: 调用方法前使用可选链 `?.` 检查 ref 是否存在
3. **触发字符**: `openSuggestion` 只接受 `'/'` 或 `'@'`，传入其他字符会插入该字符但不会触发浮窗
4. **编辑器准备**: 确保编辑器已经初始化完成再调用方法（通常在事件处理器中不会有问题）
