"use client";

import { useMemo, useState } from "react";
import { useChatSenderInputRuntime } from "@/runtime/useChatSenderInputRuntime";
import {
  ComponentPanelContainerPrimitive,
  ComponentPanelTabsListPrimitive,
  ComponentPanelTabsTriggerPrimitive,
  ComponentPanelTabsContentPrimitive,
  ComponentPanelListPrimitive,
  ComponentPanelListItemPrimitive,
  ComponentPanelListItemIconPrimitive,
} from "@/components/wuhan/blocks/component-panel-01";

import {
  SenderInput,
  type SenderInputSkillListProps,
  type SenderInputSkillItem,
} from "@/components/sender-input";

export function ChatSenderInput() {
  const {
    value,
    disabled,
    skillOptions,
    inputRef,
    onInputChange,
    onInputSubmit,
    onSkillsChange,
    onSkillPopupVisibilityChange,
  } = useChatSenderInputRuntime();
  return (
    <SenderInput
      skillReferenceSelector=".aui-composer-root"
      className="aui-composer-input p-[2px] outline-none"
      mentionLabelClassName="bg-[#EDF2FF] p-1 rounded-lg text-[#4A56FF]"
      placeholder="Send a message..."
      ref={inputRef}
      value={value}
      disabled={disabled}
      autoFocus={true}
      skillList={skillOptions}
      renderSkillList={CustomSuggestionList}
      onChange={onInputChange}
      onSubmit={onInputSubmit}
      onSkillsChange={onSkillsChange}
      onSkillPopupVisibilityChange={onSkillPopupVisibilityChange}
    />
  );
}

/**
 * 自定义建议列表组件
 * 使用 component-panel-01 组件，按类型分组显示
 */
export function CustomSuggestionList({
  items,
  command,
  selectedIds,
}: SenderInputSkillListProps) {
  console.log("CustomSuggestionList items:", selectedIds);
  // 按类型分组
  const groupedItems = useMemo(() => {
    const groups: Record<string, SenderInputSkillItem[]> = {
      mcp: [],
      tool: [],
      workflow: [],
    };

    items.forEach((item) => {
      const businessItem = item;
      const type = businessItem.type || "tool";
      if (groups[type]) {
        groups[type].push(businessItem);
      }
    });

    return groups;
  }, [items]);

  // 获取有数据的类型列表
  const availableTypes = useMemo(() => {
    return Object.keys(groupedItems).filter(
      (type) => groupedItems[type].length > 0,
    );
  }, [groupedItems]);

  // 计算当前应该显示的 tab（如果当前 tab 不在可用列表中，使用第一个可用的）
  const [activeTabState, setActiveTabState] = useState<string>("mcp");

  const activeTab = useMemo(() => {
    if (availableTypes.length === 0) return "mcp";
    if (availableTypes.includes(activeTabState)) {
      return activeTabState;
    }
    return availableTypes[0];
  }, [availableTypes, activeTabState]);

  // 如果没有数据，显示空状态
  if (items.length === 0) {
    return (
      <div style={{ padding: "16px", color: "#999" }}>没有找到匹配的结果</div>
    );
  }

  // 类型标签映射
  const typeLabels: Record<string, string> = {
    mcp: "MCP",
    tool: "工具",
    workflow: "工作流",
  };

  const onClickItem = (item: SenderInputSkillItem) => {
    if (!selectedIds?.has(item.value?.toString())) {
      command(item);
    }
  };

  return (
    <ComponentPanelContainerPrimitive
      value={activeTab}
      onValueChange={setActiveTabState}
      className="w-[var(--thread-max-width)]"
      defaultValue={availableTypes[0] || "mcp"}
    >
      <ComponentPanelTabsListPrimitive>
        {availableTypes.map((type) => (
          <ComponentPanelTabsTriggerPrimitive key={type} value={type}>
            {typeLabels[type] || type}
          </ComponentPanelTabsTriggerPrimitive>
        ))}
      </ComponentPanelTabsListPrimitive>

      {availableTypes.map((type) => (
        <ComponentPanelTabsContentPrimitive key={type} value={type}>
          <ComponentPanelListPrimitive>
            {groupedItems[type].map((item) => (
              <ComponentPanelListItemPrimitive
                key={item.value}
                onClick={() => command(item)}
                className="flex items-center gap-2"
              >
                <ComponentPanelListItemIconPrimitive>
                  {item.avatar&&<img src={item.avatar ?? ""} alt={item.label} className="bg-background size-6"/>}
                </ComponentPanelListItemIconPrimitive>
                <span className="flex-1 truncate text-left">{item.label}</span>
              </ComponentPanelListItemPrimitive>
            ))}
          </ComponentPanelListPrimitive>
        </ComponentPanelTabsContentPrimitive>
      ))}
    </ComponentPanelContainerPrimitive>
  );
}
