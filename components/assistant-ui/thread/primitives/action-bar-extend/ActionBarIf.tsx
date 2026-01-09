import { FC, type PropsWithChildren } from "react";
import {
  QueryActionStatus,
  QueryComposerActionStatus,
  QueryMessageActionStatus,
  useSmartVisionActionActions,
  useSmartVisionMessageActionActions,
} from "@/runtime/smartVisionActionRuntime";

export type Props = PropsWithChildren<QueryActionStatus>;
export const ActionBarPrimitiveIf: FC<Props> = ({
  like,
  dislike,
  dislikeFeedback,
  deepThink,
  webSearch,
  children,
}) => {
  if (
    like !== undefined ||
    dislike !== undefined ||
    dislikeFeedback !== undefined
  ) {
    return (
      <MessageActionBarPrimitiveIf
        like={like}
        dislike={dislike}
        dislikeFeedback={dislikeFeedback}
      >
        {children}
      </MessageActionBarPrimitiveIf>
    );
  }
  if (deepThink !== undefined || webSearch !== undefined) {
    return (
      <ComposerActionBarPrimitiveIf deepThink={deepThink} webSearch={webSearch}>
        {children}
      </ComposerActionBarPrimitiveIf>
    );
  }
  return null;
};

const MessageActionBarPrimitiveIf: FC<
  PropsWithChildren<QueryMessageActionStatus>
> = ({ like, dislike, dislikeFeedback, children }) => {
  const { queryMessageStatus } = useSmartVisionMessageActionActions();
  const result = queryMessageStatus({
    like,
    dislike,
    dislikeFeedback,
  });
  if (result) return <>{children}</>;
  return null;
};
const ComposerActionBarPrimitiveIf: FC<
  PropsWithChildren<QueryComposerActionStatus>
> = ({ deepThink, webSearch, children }) => {
  const { queryStatus } = useSmartVisionActionActions();
  const result = queryStatus({
    deepThink,
    webSearch,
  });
  if (result) return <>{children}</>;
  return null;
};
ActionBarPrimitiveIf.displayName = "ActionBarPrimitiveIf";
