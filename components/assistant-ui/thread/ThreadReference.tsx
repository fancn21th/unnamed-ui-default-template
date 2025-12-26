import { Reference } from "./primitives/reference";
import { X } from "lucide-react";

export const ThreadReference = () => {
  return (
    <Reference.ComposerContainer className={"flex"}>
      <Reference.Content />
      <Reference.Cancel>
        <X />
      </Reference.Cancel>
    </Reference.ComposerContainer>
  );
};
