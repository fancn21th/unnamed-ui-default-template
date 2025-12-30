"use client";

import { ChangeEvent, FC, useState } from "react";
import {
  FeedbackContainerPrimitive,
  FeedbackHeaderPrimitive,
  FeedbackInputContainerPrimitive,
  FeedbackInputPrimitive,
  FeedbackSubmitButtonPrimitive,
} from "@/components/wuhan/blocks/feedback-01";
import { ToggleButtonGroupPrimitive } from "@/components/wuhan/blocks/toggle-button-01";

export interface DislikeFeedbackData {
  options?: string[];
  content?: string;
}

type Props = {
  onSubmit?: (data: DislikeFeedbackData) => void;
  onClose?: () => void;
};

const FEEDBACK_OPTIONS: Array<{ id: string; label: string }> = [
  { id: "1", label: "有害/不安全" },
  { id: "2", label: "信息虚假" },
  { id: "3", label: "没有帮助" },
  { id: "4", label: "隐私相关" },
  { id: "5", label: "其他" },
];

const OTHER_OPTION_ID = "5";

export const DislikeFeedbackForm: FC<Props> = ({ onSubmit, onClose }) => {
  const [content, setContent] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const hasOtherSelected = selectedIds.includes(OTHER_OPTION_ID);
  const hasAnySelected = selectedIds.length > 0;

  const handleSubmit = () => {
    onSubmit?.({
      options: selectedIds.length > 0 ? selectedIds : undefined,
      content: content || undefined,
    });
    // Reset form state
    setContent("");
    setSelectedIds([]);
    onClose?.();
  };

  const handleClose = () => {
    // Reset form state on close
    setContent("");
    setSelectedIds([]);
    onClose?.();
  };

  return (
    <FeedbackContainerPrimitive className="w-[var(--thread-max-width)]" onClose={handleClose}>
      <FeedbackHeaderPrimitive
        title="有什么问题?"
        onClose={handleClose}
      />
      <ToggleButtonGroupPrimitive
        options={FEEDBACK_OPTIONS}
        multiple={true}
        selectedIds={selectedIds}
        onOptionsChange={setSelectedIds}
      />
      {hasOtherSelected && (
        <FeedbackInputContainerPrimitive>
          <FeedbackInputPrimitive
            placeholder="请输入详细描述..."
            value={content}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setContent(e.target.value)}
          />
        </FeedbackInputContainerPrimitive>
      )}
      <div>
        <FeedbackSubmitButtonPrimitive disabled={!hasAnySelected} onClick={handleSubmit}>
          提交
        </FeedbackSubmitButtonPrimitive>
      </div>
    </FeedbackContainerPrimitive>
  );
};

