export const useSmartVisionActionLink = () => {
  const queryLikeStatus = ({
    like,
    dislike,
  }: {
    like?: boolean;
    dislike?: boolean;
  }): boolean => {
    // TODO: Implement
    return false;
  };
  const onLike = () => {
    // TODO: Implement
  };
  const onDislike = () => {
    // TODO: Implement
  };
  return {
    onLike,
    onDislike,
    queryLikeStatus,
  };
};
