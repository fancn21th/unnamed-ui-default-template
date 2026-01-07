"use client";

import { ChangeEvent, FC, useState } from "react";
import {
  FeedbackContainerPrimitive,
  FeedbackHeaderPrimitive,
  FeedbackInputContainerPrimitive,
  FeedbackInputPrimitive,
  FeedbackSubmitButtonPrimitive,
} from "@/components/wuhan/blocks/feedback-01";
import {
  ToggleButtonGroupPrimitive,
  ToggleButtonPrimitive,
} from "@/components/wuhan/blocks/toggle-button-01";
import { useSmartVisionActionActions } from "@/runtime/smartVisionActionRuntime";

const FEEDBACK_OPTIONS: Array<{ id: string; label: string }> = [
  { id: "1", label: "有害/不安全" },
  { id: "2", label: "信息虚假" },
  { id: "3", label: "没有帮助" },
  { id: "4", label: "隐私相关" },
  { id: "5", label: "其他" },
];

const OTHER_OPTION_ID = "5";

export const DislikeFeedbackForm: FC = () => {
  const [content, setContent] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { onCancelDislikeFeedback, onSubmitDislikeFeedback } =
    useSmartVisionActionActions();
  const hasOtherSelected = selectedIds.includes(OTHER_OPTION_ID);
  const hasAnySelected = selectedIds.length > 0;

  const handleSubmit = () => {
    const feedback = [
      ...FEEDBACK_OPTIONS.filter(
        (d) => d.id !== OTHER_OPTION_ID && selectedIds.includes(d.id),
      ).map((d) => d.label),
      content,
    ].join(",");
    onSubmitDislikeFeedback(feedback);
    // Reset form state
    setContent("");
    setSelectedIds([]);
  };

  return (
    <FeedbackContainerPrimitive
      className="w-[var(--thread-max-width)]"
      onClose={onCancelDislikeFeedback}
    >
      <FeedbackHeaderPrimitive
        title="有什么问题?"
        onClose={onCancelDislikeFeedback}
      />
      <ToggleButtonGroupPrimitive>
        {FEEDBACK_OPTIONS.map((option) => (
          <ToggleButtonPrimitive
            key={option.id}
            selected={selectedIds.includes(option.id)}
            multiple={true}
            onClick={() => {
              setSelectedIds((prev) =>
                prev.includes(option.id)
                  ? prev.filter((id) => id !== option.id)
                  : [...prev, option.id],
              );
            }}
          >
            {option.label}
          </ToggleButtonPrimitive>
        ))}
      </ToggleButtonGroupPrimitive>
      {hasOtherSelected && (
        <FeedbackInputContainerPrimitive>
          <FeedbackInputPrimitive
            placeholder="请输入详细描述..."
            value={content}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setContent(e.target.value)
            }
          />
        </FeedbackInputContainerPrimitive>
      )}
      <div>
        <FeedbackSubmitButtonPrimitive
          disabled={!hasAnySelected}
          onClick={handleSubmit}
        >
          提交
        </FeedbackSubmitButtonPrimitive>
      </div>
    </FeedbackContainerPrimitive>
  );
};
