"use client";

import { ComponentPropsWithRef, forwardRef } from "react";
import { Slottable } from "@radix-ui/react-slot";

import {
  BlockTooltip,
  BlockTooltipContent,
  BlockTooltipTrigger,
} from "@/components/wuhan/blocks/tooltip-01";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type TooltipIconButtonProps = ComponentPropsWithRef<typeof Button> & {
  tooltip: string;
  side?: "top" | "bottom" | "left" | "right";
  asChild?: boolean;
};

export const TooltipIconButton = forwardRef<
  HTMLButtonElement,
  TooltipIconButtonProps
>(({ children, tooltip, side = "bottom", className, asChild = false, ...rest }, ref) => {
  if (asChild) {
    // When asChild is true, wrap the children directly without creating a Button
    return (
      <BlockTooltip>
        <BlockTooltipTrigger asChild>
          {children}
        </BlockTooltipTrigger>
        <BlockTooltipContent side={side}>{tooltip}</BlockTooltipContent>
      </BlockTooltip>
    );
  }

  return (
    <BlockTooltip>
      <BlockTooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          {...rest}
          className={cn("aui-button-icon size-6 p-1", className)}
          ref={ref}
        >
          <Slottable>{children}</Slottable>
          <span className="aui-sr-only sr-only">{tooltip}</span>
        </Button>
      </BlockTooltipTrigger>
      <BlockTooltipContent side={side}>{tooltip}</BlockTooltipContent>
    </BlockTooltip>
  );
});

TooltipIconButton.displayName = "TooltipIconButton";
