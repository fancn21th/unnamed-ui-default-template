/**
 * 建议项数据结构（通用选项类型）
 */
export interface SuggestionItem {
  /**
   * 唯一标识（数据 ID）
   */
  value: string | number;
  /**
   * 显示标签（纯文本名称，用于编辑器中显示）
   */
  label: string;
  /**
   * 自定义渲染（可选，用于建议列表中的复杂 UI 展示）
   */
  renderLabel?: React.ReactNode;
  /**
   * 类型信息（可选，用于区分不同类别的建议项）
   */
  type?: string;
  /**
   * 头像信息
   */
  avatar?: string | null;
}

/**
 * 建议数据提供者类型
 * - 可以是函数：根据查询和触发字符动态返回建议项
 * - 可以是数组：直接提供固定的建议项列表
 */
export type SuggestionDataProvider = 
  | ((query: string, trigger: string) => SuggestionItem[] | Promise<SuggestionItem[]>)
  | SuggestionItem[];

/**
 * Sender 组件暴露的 ref 方法
 */
export interface SenderRef {
  /**
   * 手动触发建议浮窗
   * @param trigger 触发字符（'/' 或 '@'），默认为 '/'
   */
  openSuggestion: (trigger?: string) => void;
  /**
   * 获取编辑器实例
   */
  getEditor: () => any | null;
  /**
   * 聚焦到编辑器
   */
  focus: () => void;
}

/**
 * Sender 组件的属性接口
 */
export interface SenderProps {
  /**
   * 当前编辑器的值
   */
  value?: string;
  /**
   * 值变化时的回调
   */
  onChange?: (text: string) => void;
  /**
   * Mention 标签变化时的回调
   */
  onMentionsChange?: (mentions: SuggestionItem[]) => void;
  /**
   * 提交时的回调（通常是按 Enter 键时触发）
   * @returns 返回 false 可以阻止提交
   */
  onSubmit?: (text: string) => boolean | void;
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 是否自动聚焦
   */
  autoFocus?: boolean;
  /**
   * placeholder 文本
   */
  placeholder?: string;
  /**
   * 自定义样式类名
   */
  className?: string;
  /**
   * 建议项数据提供者
   * 当输入 / 或 @ 时触发
   */
  suggestionDataProvider?: SuggestionDataProvider;
  /**
   * 选择建议项时的回调
   */
  onSuggestionSelect?: (item: SuggestionItem) => void;
  /**
   * 自定义 mention 标签渲染函数
   * 用于自定义 mention 在编辑器中的显示样式
   */
  renderMentionLabel?: (item: SuggestionItem) => React.ReactNode;
  /**
   * 自定义建议列表渲染组件
   * 用于完全自定义浮窗列表的样式和结构
   */
  renderSuggestionList?: React.ComponentType<{
    items: SuggestionItem[];
    command: (item: SuggestionItem) => void;
  }>;
  /**
   * 浮窗定位参考元素的选择器（CSS 选择器）
   * 如果设置，建议浮窗将固定在指定元素上方
   * 默认为未设置，浮窗跟随光标位置
   */
  referenceSelector?: string;
}
