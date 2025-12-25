"use client";

import type { FC } from "react";
import { ThreadPrimitive } from "@assistant-ui/react";
import { PromptGroup, PromptButton } from "@/components/wuhan/blocks/prompt-01";
import { m } from "motion/react";

export const ThreadSuggestions: FC = () => {
  const suggestions = [
    {
      title: "What's the weather",
      label: "in San Francisco?",
      action: "What's the weather in San Francisco?",
    },
    {
      title: "Explain React hooks",
      label: "like useState and useEffect",
      action: "Explain React hooks like useState and useEffect",
    },
  ];

  return (
    <PromptGroup className="aui-thread-welcome-suggestions flex w-full gap-2">
      {suggestions.map((suggestedAction, index) => (
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className="aui-thread-welcome-suggestion-display [&:nth-child(n+3)]:hidden @md:[&:nth-child(n+3)]:block"
        >
          <ThreadPrimitive.Suggestion
            prompt={suggestedAction.action}
            send
            asChild
          >
            <PromptButton
              className="aui-thread-welcome-suggestion"
              aria-label={suggestedAction.action}
            >
              {suggestedAction.title} {suggestedAction.label}
            </PromptButton>
          </ThreadPrimitive.Suggestion>
        </m.div>
      ))}
    </PromptGroup>
  );
};
