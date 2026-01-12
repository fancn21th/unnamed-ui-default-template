import { Reference } from "./primitives/reference";
import { X, CornerDownRight } from "lucide-react";
import {
  QuoteContent,
  QuoteContentLeading,
  QuoteContentContent,
  QuoteContentText,
  QuoteContentCloseButton,
} from "@/components/wuhan/blocks/quote-content-01";

export const ThreadReference = () => {
  return (
    <Reference.ComposerContainer asChild>
      <QuoteContent className="mb-[calc(-1*var(--gap-xs))]">
        <QuoteContentLeading>
          <CornerDownRight className="h-4 w-4" />
        </QuoteContentLeading>
        <QuoteContentContent>
          <QuoteContentText>
            <Reference.Content />
          </QuoteContentText>
        </QuoteContentContent>
        <Reference.Cancel asChild>
          <QuoteContentCloseButton>
            <X className="h-4 w-4" />
          </QuoteContentCloseButton>
        </Reference.Cancel>
      </QuoteContent>
    </Reference.ComposerContainer>
  );
};
