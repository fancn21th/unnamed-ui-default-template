# Sender 组件

富文本输入组件，基于 Tiptap 构建，支持 `/` 和 `@` 命令菜单。

## 📁 文件结构

```
sender/
├── index.ts                  # 入口文件，导出所有公开接口
├── Sender.tsx                # 主组件实现
├── SenderAdapter.tsx         # assistant-ui 适配器
├── types.ts                  # TypeScript 类型定义
├── extensions/               # 编辑器扩展（公共资源）
│   ├── index.ts             # 扩展配置入口
│   └── mention.ts           # Mention 扩展实现
├── suggestions/              # 建议菜单模块
│   ├── SuggestionList.tsx   # 浮窗列表组件
│   └── mockData.ts          # Mock 数据提供者
└── styles/                   # 样式文件
    ├── sender.css           # 编辑器样式
    └── suggestion.css       # 建议菜单样式
```

## 🚀 使用方式

### 在当前项目中（使用适配器）

```tsx
import { SenderAdapter } from "@/components/sender";

<SenderAdapter />
```

### 独立使用

```tsx
import { Sender, defaultSuggestionDataProvider } from "@/components/sender";

<Sender
  value={text}
  onChange={setText}
  onSubmit={(text) => console.log(text)}
  suggestionDataProvider={defaultSuggestionDataProvider}
/>
```

### 自定义数据源

```tsx
import { Sender, createSuggestionDataProvider } from "@/components/sender";

const customProvider = createSuggestionDataProvider({
  tools: [...],
  workflows: [...],
  mcps: [...],
});

<Sender suggestionDataProvider={customProvider} />
```

## ✨ 功能特性

- 输入 `/` 或 `@` 触发命令菜单
- 键盘导航（上下箭头、Enter、Escape）
- Mention 节点整体删除
- 按类型区分颜色
- 低耦合设计，易于扩展

## 🔧 架构设计

- **extensions/** - 编辑器核心扩展，可复用的公共资源
- **suggestions/** - 建议菜单业务逻辑，与具体功能相关
- **styles/** - 样式隔离，便于主题定制
