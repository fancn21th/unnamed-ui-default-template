import {
  FC,
  type PropsWithChildren,
} from "react";
import { useSmartVisionActionActions } from "@/runtime/smartVisionActionRuntime";

export type Props = PropsWithChildren<{ like?: boolean; dislike?: boolean }>;
export const ActionBarPrimitiveLikeIf: FC<Props> = ({
  like,
  dislike,
  children,
}) => {
  const { queryLikeStatus } = useSmartVisionActionActions();
  const result = queryLikeStatus({ like, dislike });
  if (result) return <>{children}</>;
  return null;
};
ActionBarPrimitiveLikeIf.displayName = "ActionBarPrimitiveLikeIf";
