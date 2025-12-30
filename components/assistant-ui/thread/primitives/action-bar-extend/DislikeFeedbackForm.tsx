"use client";

import { ChangeEvent, FC, useState } from "react";
import {
    FeedbackButtonGroupPrimitive,
  FeedbackContainerPrimitive,
  FeedbackHeaderPrimitive,
  FeedbackInputContainerPrimitive,
  FeedbackInputPrimitive,
  FeedbackSubmitButtonPrimitive,
} from "@/components/wuhan/blocks/feedback-01";
import { ToggleButtonGroupPrimitive } from "@/components/wuhan/blocks/toggle-button-01";

type Props = {
  onSubmit?: (content?: string) => void;
  onClose?: () => void;
};

export const DislikeFeedbackForm: FC<Props> = ({ onSubmit, onClose }) => {
  const [content, setContent] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<string>("1");
  const handleSubmit = () => {
    onSubmit?.(content || undefined);
    setContent("");
    onClose?.();
  };

  return (
    <FeedbackContainerPrimitive onClose={onClose}>
      <FeedbackHeaderPrimitive
        title="有什么问题?"
        onClose={onClose}
      />
      <ToggleButtonGroupPrimitive
              options={[
                { id: "1", label: "有害/不安全" },
                { id: "2", label: "信息虚假" },
                { id: "3", label: "没有帮助" },
                { id: "4", label: "隐私相关" },
                { id: "5", label: "其他" },
              ]}    
              selectedId={selectedOption}
              onOptionChange={(id) => {setSelectedOption(id)}}
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

