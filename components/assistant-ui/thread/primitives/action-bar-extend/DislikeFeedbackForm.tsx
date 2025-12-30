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
  option?: string;
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

const DEFAULT_OPTION = "1";

export const DislikeFeedbackForm: FC<Props> = ({ onSubmit, onClose }) => {
  const [content, setContent] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<string>(DEFAULT_OPTION);

  const handleSubmit = () => {
    onSubmit?.({
      option: selectedOption,
      content: content || undefined,
    });
    // Reset form state
    setContent("");
    setSelectedOption(DEFAULT_OPTION);
    onClose?.();
  };

  const handleClose = () => {
    // Reset form state on close
    setContent("");
    setSelectedOption(DEFAULT_OPTION);
    onClose?.();
  };

  return (
    <FeedbackContainerPrimitive onClose={handleClose}>
      <FeedbackHeaderPrimitive
        title="有什么问题?"
        onClose={handleClose}
      />
      <ToggleButtonGroupPrimitive
        options={FEEDBACK_OPTIONS}
        selectedId={selectedOption}
        onOptionChange={setSelectedOption}
      />
      <FeedbackInputContainerPrimitive>
        <FeedbackInputPrimitive
          placeholder="请输入详细描述..."
          value={content}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setContent(e.target.value)}
        />
      </FeedbackInputContainerPrimitive>
      <div>
        <FeedbackSubmitButtonPrimitive onClick={handleSubmit}>
          提交
        </FeedbackSubmitButtonPrimitive>
      </div>
    </FeedbackContainerPrimitive>
  );
};

