import { ChangeEvent, FC, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import * as React from "react";
import {
  useSmartVisionMessageActionActions,
} from "@/runtime/smartVisionActionRuntime";

export const DislikeFeedbackForm: FC = () => {
  const [content, setContent] = useState<string>("");
  const { onCancelDislikeFeedback, onSubmitDislikeFeedback } =
    useSmartVisionMessageActionActions();
  const onContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };
  const onSubmitClick = () => {
    onSubmitDislikeFeedback(content);
    setContent("");
  };

  return (
    <div className="flex flex-col">
      <div>
        你的反馈将帮助我们进步
        <Button onClick={onCancelDislikeFeedback}>
          <XIcon />
        </Button>
      </div>
      <TextareaAutosize
        value={content}
        onChange={onContentChange}
        className="aui-composer-input mb-1 max-h-32 min-h-16 w-full resize-none bg-transparent px-3.5 pt-1.5 pb-3 text-base outline-none placeholder:text-muted-foreground focus:outline-primary"
      />
      <div>
        <Button onClick={onSubmitClick}>提交</Button>
      </div>
    </div>
  );
};
