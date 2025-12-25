import { FC } from "react";
import { ThreadSuggestions } from "./ThreadSuggestions";
import {
  WelcomeContainer,
  WelcomeIcon,
  WelcomeText,
} from "@/components/wuhan/blocks/welcome-01";
import { Sparkles } from "lucide-react";

export const ThreadWelcome: FC = () => {
  return (
    <div className="aui-thread-welcome-root flex w-full flex-col gap-4 items-center">
      <div className="aui-thread-welcome-center flex w-full flex-col items-center justify-center">
        <div className="aui-thread-welcome-message flex flex-col items-center justify-center px-8">
          <WelcomeContainer>
            <WelcomeIcon>
              <Sparkles />
            </WelcomeIcon>
            <WelcomeText>Hello there! How can I help you today?</WelcomeText>
          </WelcomeContainer>
        </div>
      </div>
      <ThreadSuggestions />
    </div>
  );
};
