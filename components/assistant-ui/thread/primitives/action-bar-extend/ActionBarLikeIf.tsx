import {
  ComponentPropsWithoutRef,
  type ComponentRef,
  FC,
  forwardRef,
  type PropsWithChildren,
} from "react";
import { Primitive } from "@radix-ui/react-primitive";
import { composeEventHandlers } from "@radix-ui/primitive";
import { useSmartVisionActionLink } from "@/runtime/smartVisionActionLink";

export type Props = PropsWithChildren<{ like?: boolean; dislike?: boolean }>;
export const ActionBarPrimitiveLikeIf: FC<Props> = ({
  like,
  dislike,
  children,
}) => {
  const { queryLikeStatus } = useSmartVisionActionLink();
  const result = queryLikeStatus({ like, dislike });
  if (result) return <>{children}</>;
  return null;
};
ActionBarPrimitiveLikeIf.displayName = "ActionBarPrimitiveLikeIf";
