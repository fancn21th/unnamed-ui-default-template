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
    <Reference.ComposerContainer>
      <QuoteContent>
        <QuoteContentLeading>
          <CornerDownRight className="w-4 h-4" />
        </QuoteContentLeading>
        <QuoteContentContent>
          <QuoteContentText>
            <Reference.Content></Reference.Content>
          </QuoteContentText>
        </QuoteContentContent>
        <Reference.Cancel>
          <QuoteContentCloseButton>
            <X className="w-4 h-4" />
          </QuoteContentCloseButton>
        </Reference.Cancel>
      </QuoteContent>
    </Reference.ComposerContainer>
  );
};
