import { FC } from "react";
import { domAnimation, LazyMotion, MotionConfig } from "motion/react";
import { ThreadPrimitive } from "@assistant-ui/react";
import { Composer } from "./Composer";
import { ThreadWelcome } from "./ThreadWelcome";
import { UserMessage } from "./UserMessage";
import { EditComposer } from "./EditComposer";
import { AssistantMessage } from "./AssistantMessage";

export const Thread: FC = () => {
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <ThreadPrimitive.Root
          className="aui-root aui-thread-root @container flex h-full flex-col bg-background"
          style={{
            ["--thread-max-width" as string]: "44rem",
          }}
        >
          <ThreadPrimitive.Viewport className="aui-thread-viewport relative flex flex-1 flex-col overflow-x-auto overflow-y-scroll px-4">
            <ThreadPrimitive.If empty>
              <div className="flex h-full flex-col items-center justify-center">
                <div className="mx-auto flex w-full max-w-[var(--thread-max-width)] flex-col items-center gap-6">
                  <ThreadWelcome />
                  <Composer sticky={false} />
                </div>
              </div>
            </ThreadPrimitive.If>

            <ThreadPrimitive.Messages
              components={{
                UserMessage,
                EditComposer,
                AssistantMessage,
              }}
            />

            <ThreadPrimitive.If empty={false}>
              <div className="aui-thread-viewport-spacer min-h-8 grow" />
            </ThreadPrimitive.If>

            <ThreadPrimitive.If empty={false}>
              <Composer sticky={true} />
            </ThreadPrimitive.If>
          </ThreadPrimitive.Viewport>
        </ThreadPrimitive.Root>
      </MotionConfig>
    </LazyMotion>
  );
};
