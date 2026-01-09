export interface SenderInputProps {
  /**
   * 当前编辑器的值
   */
  value?: string;
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
   * 技能列表
   */
  skillList?: SkillItem[];
  /**
   * 值变化时的回调
   */
  onChange?: (text: string) => void;
  /**
   * 提交时的回调（通常是按 Enter 键时触发）
   * @returns 返回 false 可以阻止提交
   */
  onSubmit?: (text: string) => boolean | void;
}

export interface SkillItem {
  /**
   * 唯一标识
   */
  value: string | number;
  /**
   * 显示标签（纯文本名称，用于编辑器中显示）
   */
  label: string;
  /**
   * 技能类型
   */
  type?: string;
  /**
   * 自定义渲染（可选，用于技能列表中的复杂 UI 展示）
   */
  renderLabel?: React.ReactNode;
}
