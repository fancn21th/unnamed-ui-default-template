"use client";

import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import type { SuggestionItem } from "../types";

export interface SuggestionListProps {
  items: SuggestionItem[];
  command: (item: SuggestionItem) => void;
}

export interface SuggestionListRef {
  onKeyDown: (event: KeyboardEvent) => boolean;
}

/**
 * 建议列表浮窗组件
 */
export const SuggestionList = forwardRef<
  SuggestionListRef,
  SuggestionListProps
>(({ items, command }, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [prevItems, setPrevItems] = useState(items);

  // 当 items 改变时重置 selectedIndex (在 render 阶段调整状态)
  if (items !== prevItems) {
    setPrevItems(items);
    setSelectedIndex(0);
  }

  // 确保 selectedIndex 在有效范围内
  const validSelectedIndex = useMemo(() => {
    return items.length > 0 ? Math.min(selectedIndex, items.length - 1) : 0;
  }, [selectedIndex, items.length]);

  const selectItem = (index: number) => {
    const item = items[index];
    if (item) {
      command(item);
    }
  };

  useImperativeHandle(
    ref,
    () => ({
      onKeyDown: (event: KeyboardEvent) => {
        if (event.key === "ArrowUp") {
          setSelectedIndex((prev) => (prev + items.length - 1) % items.length);
          return true;
        }

        if (event.key === "ArrowDown") {
          setSelectedIndex((prev) => (prev + 1) % items.length);
          return true;
        }

        if (event.key === "Enter") {
          selectItem(validSelectedIndex);
          return true;
        }

        return false;
      },
    }),
    [items.length, validSelectedIndex],
  );

  if (items.length === 0) {
    return (
      <div className="suggestion-list-empty">
        <div className="suggestion-item-empty">No results found</div>
      </div>
    );
  }

  return (
    <div className="suggestion-list">
      {items.map((item, index) => (
        <button
          key={item.value}
          type="button"
          className={`suggestion-item ${index === validSelectedIndex ? "is-selected" : ""}`}
          onClick={() => selectItem(index)}
        >
          <div className="suggestion-item-content">
            {item.renderLabel || item.label}
          </div>
        </button>
      ))}
    </div>
  );
});

SuggestionList.displayName = "SuggestionList";
