import { FC, type PropsWithChildren } from "react";
import {
  useSmartVisionActionActions,
  useSmartVisionActionStore,
} from "@/runtime/smartVisionActionRuntime";

export type Props = PropsWithChildren<{
  like?: boolean;
  dislike?: boolean;
  dislikeFeedback?: boolean;
}>;
export const ActionBarPrimitiveLikeIf: FC<Props> = ({
  like,
  dislike,
  dislikeFeedback,
  children,
}) => {
  const { queryLikeStatus } = useSmartVisionActionActions();
  const result = queryLikeStatus({ like, dislike, dislikeFeedback });
  if (result) return <>{children}</>;
  return null;
};
ActionBarPrimitiveLikeIf.displayName = "ActionBarPrimitiveLikeIf";
