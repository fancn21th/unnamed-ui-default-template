/**
 * SenderInput 组件的属性类型定义
 */
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
   * 技能触发字符（如 "/" 或 "@"）默认为 "/"
   */
  skillTriggerString?: string;
  /**
   * 技能列表
   */
  skillList?: SenderInputSkillItem[];
  /**
   * 浮窗定位参考元素的选择器（CSS 选择器）
   * 如果设置，建议浮窗将固定在指定元素上方
   * 默认为未设置，浮窗跟随光标位置
   */
  skillReferenceSelector?: string;
  /**
   * 值变化时的回调
   */
  onChange?: (text: string) => void;
  /**
   * 技能选择时的回调
   */
  onSkillsChange?: (mentions: SenderInputSkillItem[]) => void;
  /**
   * 技能浮窗显示/隐藏状态变化时的回调
   */
  onSkillPopupVisibilityChange?: (visible: boolean) => void;
  /**
   * 提交时的回调（通常是按 Enter 键时触发）
   * @returns 返回 false 可以阻止提交
   */
  onSubmit?: (text: string) => boolean | void;
  /**
   * 自定义技能列表渲染组件
   * 用于完全自定义浮窗列表的样式和结构
   */
  renderSkillList?: React.ComponentType<SenderInputSkillListProps>;
  /**
   * 编辑器内 mention 标签的自定义 className
   * 用于通过 CSS 自定义已插入技能的显示样式
   */
  mentionLabelClassName?: string;
}

/**
 * SenderInput 组件的 ref 类型定义
 */
export interface SenderInputInstance {
  /**
   * 触发技能菜单打开
   * @param trigger 触发字符（'/' 或 '@'），默认为 '/'
   */
  openSkill: (trigger?: string) => void;
}

/**
 * SkillItem 类型定义
 */
export interface SenderInputSkillItem {
  /**
   * 唯一标识
   */
  value: string | number;
  /**
   * 显示标签（纯文本名称，用于编辑器中显示）
   */
  label: string;
  /**
   * 头像信息
   */
  avatar?: string | null;
}

/**
 * SkillListProps 类型定义
 */
export interface SenderInputSkillListProps {
  /**
   * 技能项列表
   */
  items: SenderInputSkillItem[];
  /**
   * 选择技能项的回调
   */
  command: (item: SenderInputSkillItem) => void;
  /**
   * 已选中的技能 ID 列表
   */
  selectedIds?: Set<string | number>;
}

/**
 * SkillExtensionOptions 类型定义
 */
export interface MentionExtensionOptions
  extends Pick<
    SenderInputProps,
    | "skillReferenceSelector"
    | "renderSkillList"
    | "onSkillPopupVisibilityChange"
    | "mentionLabelClassName"
  > {
  /**
   * 触发字符（如 "/" 或 "@"）
   */
  trigger: string;
  /**
   * 扩展名称（用于区分多个 Mention 实例）
   */
  name?: string;
  /**
   * 数据选项
   */
  options: SenderInputSkillItem[];
}

export interface SkillListInstance {
  onKeyDown: (event: KeyboardEvent) => boolean;
}
