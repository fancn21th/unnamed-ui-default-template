import type { FC } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const ThreadListSkeleton: FC = () => {
  return (
    <>
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i}
          role="status"
          aria-label="Loading threads"
          aria-live="polite"
          className={cn(
            "flex items-center",
            "gap-[var(--gap-md)]",
            "pt-[var(--padding-com-sm)]",
            "pr-[var(--padding-com-lg)]",
            "pb-[var(--padding-com-sm)]",
            "pl-[var(--padding-com-lg)]",
            "h-[34px]",
          )}
        >
          <Skeleton className="h-[22px] flex-grow rounded-[var(--radius-circle)]" />
        </div>
      ))}
    </>
  );
};