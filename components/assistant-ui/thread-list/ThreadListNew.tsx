import type { FC } from "react";
import { ThreadListPrimitive,  } from "@assistant-ui/react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export const ThreadListNew: FC = () => {
  return (
    <ThreadListPrimitive.New asChild>
      <Button
        className="aui-thread-list-new flex items-center justify-start gap-1 rounded-lg px-2.5 py-2 text-start hover:bg-muted data-active:bg-muted"
        variant="ghost"
      >
        <PlusIcon />
        New Thread
      </Button>
    </ThreadListPrimitive.New>
  );
};