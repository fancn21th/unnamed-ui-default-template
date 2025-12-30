import { ChangeEvent, FC, PropsWithChildren, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "@/components/ui/button";

type Props = PropsWithChildren<{
  onSubmit?: (content?: string) => void;
}>;
export const DislikeFeedbackDialog: FC<Props> = ({ children, onSubmit }) => {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState<string>();
  const onOpenChange = (visible: boolean) => {
    setOpen(visible);
    if (!visible) {
      onSubmit?.();
      setContent(undefined);
    }
  };
  const onContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };
  const onSubmitClick = () => {
    onSubmit?.(content);
    setOpen(false);
    setContent(undefined);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger
        className="aui-attachment-preview-trigger cursor-pointer transition-colors hover:bg-accent/50"
        asChild
      >
        {children}
      </DialogTrigger>
      <DialogContent className="aui-attachment-preview-dialog-content p-2 sm:max-w-3xl [&_svg]:text-background [&>button]:rounded-full [&>button]:bg-foreground/60 [&>button]:p-1 [&>button]:opacity-100 [&>button]:!ring-0 [&>button]:hover:[&_svg]:text-destructive">
        <DialogTitle className="aui-sr-only sr-only">
          你的反馈将帮助我们进步
        </DialogTitle>
        <div className="aui-attachment-preview relative mx-auto flex max-h-[80dvh] w-full items-center justify-center overflow-hidden bg-background">
          <TextareaAutosize
            value={content}
            onChange={onContentChange}
            className="aui-composer-input mb-1 max-h-32 min-h-16 w-full resize-none bg-transparent px-3.5 pt-1.5 pb-3 text-base outline-none placeholder:text-muted-foreground focus:outline-primary"
          />
        </div>

        <DialogFooter>
          <Button onClick={onSubmitClick}>提交</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
