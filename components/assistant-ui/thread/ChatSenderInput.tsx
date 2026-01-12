"use client";

import { useChatSenderInputRuntime } from "@/runtime/useChatSenderInputRuntime";
import { SenderInput } from "../../sender-input";

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
      onChange={onInputChange}
      onSubmit={onInputSubmit}
      onSkillsChange={onSkillsChange}
      onSkillPopupVisibilityChange={onSkillPopupVisibilityChange}
    />
  );
}
