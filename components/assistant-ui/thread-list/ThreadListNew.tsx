import type { FC } from "react";
import { ThreadListPrimitive } from "@assistant-ui/react";
import { SidebarNewButtonPrimitive } from "@/components/wuhan/blocks/sidebar-01";
import { SquarePlus } from "lucide-react";

export const ThreadListNew: FC = () => {
  return (
    <ThreadListPrimitive.New asChild>
      <SidebarNewButtonPrimitive>
        <SquarePlus className="size-4" />
        新对话
      </SidebarNewButtonPrimitive>
    </ThreadListPrimitive.New>
  );
};